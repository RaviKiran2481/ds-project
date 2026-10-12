import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles, useTexture } from '@react-three/drei'

function NatureScene() {
  const texture = useTexture('/nature.jpg')
  const group = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    state.camera.position.x = Math.sin(t * 0.08) * 0.6 + state.pointer.x * 0.8
    state.camera.position.y = Math.cos(t * 0.06) * 0.35 + state.pointer.y * 0.5
    state.camera.lookAt(0, 0, -10)
  })

  return (
    <group ref={group}>
      <mesh position={[0, 0, -10]}>
        <planeGeometry args={[30, 18]} />
        <meshStandardMaterial map={texture} roughness={1} metalness={0} />
      </mesh>
      {/* drifting pollen / fireflies for depth */}
      <Sparkles count={90} scale={[22, 12, 6]} position={[0, 0, -6]} size={2.2} speed={0.35} color="#ffe9a8" opacity={0.55} />
      <Sparkles count={40} scale={[20, 10, 4]} position={[0, -1, -8]} size={1.4} speed={0.2} color="#b7f0c0" opacity={0.35} />
    </group>
  )
}

export default function Background3D() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  if (isMobile) return null
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 0], fov: 60 }} dpr={[1, 1.5]}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 4, 2]} intensity={0.8} />
        <NatureScene />
      </Canvas>
    </div>
  )
}
