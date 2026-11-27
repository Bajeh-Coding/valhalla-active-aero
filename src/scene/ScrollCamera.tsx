import { useFrame, useThree } from '@react-three/fiber'
import { useScrollStore } from './scrollStore'

/** Applies scroll-store camera pose each frame (GSAP writes the store). */
export function ScrollCamera() {
  const { camera } = useThree()

  useFrame(() => {
    const { cameraPosition, lookAt } = useScrollStore.getState()
    camera.position.set(
      cameraPosition[0],
      cameraPosition[1],
      cameraPosition[2],
    )
    camera.lookAt(lookAt[0], lookAt[1], lookAt[2])
  })

  return null
}
