import * as THREE from 'three'

/**
 * Body paint after load — GLB Paint meshes use PaletteMaterial006 with lime/yellow
 * COLOR_0 (≈0.74, 0.90, 0.23) × palette atlas. Neutralize those and tint white metallic.
 * Leave Carbon1 / glass (PaletteMaterial003) / Wheel1A / grilles / interiors alone.
 *
 * Shared by Cap 05 Valhalla3D and Cap 03 Cap03DofViewer.
 */
const BODY_PAINT_WHITE = '#f3f3f1'
const BODY_PAINT_METALNESS = 0.88
const BODY_PAINT_ROUGHNESS = 0.3
const BODY_PAINT_MAT_RE = /^PaletteMaterial006$/i
const BODY_PAINT_MESH_RE = /Paint/i
const BODY_PAINT_SKIP_RE =
  /Carbon|Glass|Window|Wheel|Calliper|Caliper|Interior|Grille|Badge|Engine|Light|Textured|Manufacturer/i

/**
 * Retint Valhalla body paint to white metallic on MeshStandardMaterial after GLTF load.
 * Paint identity: material PaletteMaterial006 and/or mesh name containing "Paint".
 * Clones materials so the shared useGLTF cache stays untouched.
 */
export function applyWhiteMetallicBodyPaint(root: THREE.Object3D) {
  const remap = new Map<THREE.Material, THREE.MeshStandardMaterial>()

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!mesh.isMesh || !mesh.material) return
    if (BODY_PAINT_SKIP_RE.test(mesh.name)) return

    const source = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    const meshIsPaint = BODY_PAINT_MESH_RE.test(mesh.name)
    let changed = false
    const nextMats = source.map((mat) => {
      const std = mat as THREE.MeshStandardMaterial
      if (!std?.isMeshStandardMaterial) return mat

      if (/_WhiteMetallic$/i.test(std.name || '')) return mat

      const matIsPaint = BODY_PAINT_MAT_RE.test(std.name || '')
      if (!meshIsPaint && !matIsPaint) return mat

      let painted = remap.get(std)
      if (!painted) {
        painted = std.clone()
        painted.name = `${(std.name || 'BodyPaint').replace(/_WhiteMetallic$/i, '')}_WhiteMetallic`
        painted.color.set(BODY_PAINT_WHITE)
        painted.metalness = BODY_PAINT_METALNESS
        painted.roughness = BODY_PAINT_ROUGHNESS
        // Gold/yellow is baked in COLOR_0 + palette base map — drop both for a clean tint.
        painted.map = null
        painted.vertexColors = false
        painted.envMapIntensity = Math.max(painted.envMapIntensity ?? 1, 1.05)
        painted.needsUpdate = true
        remap.set(std, painted)
      }
      changed = true
      return painted
    })

    if (changed) {
      mesh.material = Array.isArray(mesh.material) ? nextMats : nextMats[0]!
    }
  })
}
