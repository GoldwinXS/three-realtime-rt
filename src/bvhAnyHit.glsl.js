// bvhAnyHit.glsl.js
//
// An ANY-HIT (occlusion) BVH traversal for shadow rays, meant to be concatenated
// AFTER three-mesh-bvh's `shaderStructs` + `shaderIntersectFunction` GLSL chunks in a
// GLSL3 (#version 300 es / WebGL2) fragment shader. Unlike closest-hit, this does an
// UNORDERED traversal (no near/far child ordering, no closest-hit tracking) and returns
// true on the first triangle hit within maxDist — up to ~2x cheaper for occlusion.
//
// Mirrored from three-mesh-bvh@0.7.8 sources (local paths relative to repo root):
//   node_modules/three-mesh-bvh/src/gpu/glsl/bvh_struct_definitions.glsl.js
//     - struct BVH { usampler2D index; sampler2D position; sampler2D bvhBounds; usampler2D bvhContents; }
//   node_modules/three-mesh-bvh/src/gpu/glsl/bvh_ray_functions.glsl.js
//     - _bvhIntersectFirstHit()      : traversal loop structure + node/leaf decode this file mirrors
//     - intersectsBVHNodeBounds()    : REUSED for per-node bounds test (signature: rayOrigin, rayDirection, sampler2D bvhBounds, uint nodeIndex, out float dist)
//     - intersectsTriangle()         : REUSED for the per-triangle test (double-sided; see note below)
//   node_modules/three-mesh-bvh/src/gpu/glsl/common_functions.glsl.js
//     - uTexelFetch1D() / texelFetch1D() : REUSED for index/position/contents fetches
//     - #define BVH_STACK_DEPTH 60   : REUSED (this file uses the same define, defaulting to 60)
//     - #define INFINITY             : available but unused here
//   (bvh_ray_functions.glsl.js also provides #define TRI_INTERSECT_EPSILON used inside intersectsTriangle.)
//
// Layout assumptions (must hold for the reused decode to be correct):
//   - bvhContents texel per node: .x packs (isLeaf flag in high 16 bits | (count if leaf else splitAxis) in low 16 bits),
//     .y = triangle offset (leaf) or right-child node index (internal). Left child = nodeIndex + 1u.
//   - bvhBounds stores two texels per node (min, max) at nodeIndex*2u / nodeIndex*2u+1u (handled inside intersectsBVHNodeBounds).
//   - index texel .xyz = the three vertex indices of a triangle; position texel .rgb = a vertex position.
//
// Double-sided note: shadow rays must be blocked by back faces too. intersectsTriangle() is
// inherently double-sided — its barycentric acceptance test uses a signed 1/det, so it accepts
// both front- and back-facing hits (bvhIntersectFirstHit relies on the same test and does no
// `side` culling). We therefore reuse it directly and ignore the `side` output.
//
// If three-mesh-bvh is upgraded, re-check the three files above (esp. the bvhContents bit layout
// and the intersectsTriangle / intersectsBVHNodeBounds signatures) against these assumptions.

export const BVH_ANY_HIT_GLSL = /* glsl */ `

// Returns true if ANY triangle in the BVH is hit by the ray within (0, maxDist).
// Unordered traversal with early-out; no closest-hit bookkeeping.
bool bvhIntersectAnyHit( BVH bvh, vec3 rayOrigin, vec3 rayDirection, float maxDist ) {

	// Same fixed-size stack as _bvhIntersectFirstHit: sized for the tree's max depth,
	// large enough because we push both children each internal node.
	int ptr = 0;
	uint stack[ BVH_STACK_DEPTH ];
	stack[ 0 ] = 0u;

	// scratch outputs for the (reused) triangle test
	vec3 triBarycoord, triNormal;
	float triDist, triSide;

	while ( ptr > - 1 && ptr < BVH_STACK_DEPTH ) {

		uint currNodeIndex = stack[ ptr ];
		ptr --;

		// prune: skip nodes the ray misses or whose entry distance is already past maxDist
		float boundsHitDistance;
		if (
			! intersectsBVHNodeBounds( rayOrigin, rayDirection, bvh.bvhBounds, currNodeIndex, boundsHitDistance )
			|| boundsHitDistance > maxDist
		) {

			continue;

		}

		uvec2 boundsInfo = uTexelFetch1D( bvh.bvhContents, currNodeIndex ).xy;
		bool isLeaf = bool( boundsInfo.x & 0xffff0000u );

		if ( isLeaf ) {

			uint count = boundsInfo.x & 0x0000ffffu;
			uint offset = boundsInfo.y;

			// test each triangle in the leaf; early-out on the first valid occluder
			for ( uint i = offset, l = offset + count; i < l; i ++ ) {

				uvec3 indices = uTexelFetch1D( bvh.index, i ).xyz;
				vec3 a = texelFetch1D( bvh.position, indices.x ).rgb;
				vec3 b = texelFetch1D( bvh.position, indices.y ).rgb;
				vec3 c = texelFetch1D( bvh.position, indices.z ).rgb;

				if (
					intersectsTriangle( rayOrigin, rayDirection, a, b, c, triBarycoord, triNormal, triDist, triSide )
					&& triDist > 0.0 && triDist < maxDist
				) {

					return true;

				}

			}

		} else {

			// unordered: push both children, no near/far ordering
			uint leftIndex = currNodeIndex + 1u;
			uint rightIndex = boundsInfo.y;

			ptr ++;
			stack[ ptr ] = leftIndex;

			ptr ++;
			stack[ ptr ] = rightIndex;

		}

	}

	return false;

}
`;
