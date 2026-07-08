import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Floating 3D trapezoid prisms — the Alltak escudo shape, extruded.
// Slow drift + rotation, mouse parallax on the whole group.

function trapezoidGeometry(depth = 0.55) {
  // official escudo orientation: NARROW top, WIDE bottom (keystone "A" form)
  const s = new THREE.Shape()
  s.moveTo(-0.72, 0.45)
  s.lineTo(0.72, 0.45)
  s.lineTo(1.0, -0.45)
  s.lineTo(-1.0, -0.45)
  s.closePath()
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2 })
  g.center()
  return g
}

type PrismSpec = {
  pos: [number, number, number]
  scale: number
  speed: number
  rot: [number, number]
  kind: 'blue' | 'navy' | 'wire' | 'cream'
}

const SPECS: PrismSpec[] = [
  { pos: [-4.4, 1.6, -2], scale: 1.25, speed: 0.55, rot: [0.4, 0.7], kind: 'blue' },
  { pos: [4.6, -1.2, -3], scale: 1.7, speed: 0.4, rot: [0.6, 0.35], kind: 'navy' },
  { pos: [3.6, 2.2, -5], scale: 1.0, speed: 0.7, rot: [0.3, 0.8], kind: 'wire' },
  { pos: [-3.4, -2.2, -4], scale: 0.85, speed: 0.8, rot: [0.8, 0.4], kind: 'wire' },
  { pos: [0.4, 2.8, -6], scale: 0.7, speed: 0.6, rot: [0.5, 0.6], kind: 'blue' },
  { pos: [-1.6, -3.0, -6], scale: 0.6, speed: 0.9, rot: [0.7, 0.5], kind: 'cream' },
  { pos: [6.2, 1.0, -7], scale: 0.9, speed: 0.5, rot: [0.4, 0.9], kind: 'navy' },
  { pos: [-6.0, -0.4, -6], scale: 1.1, speed: 0.45, rot: [0.55, 0.5], kind: 'blue' },
]

function Prism({ spec, geo }: { spec: PrismSpec; geo: THREE.ExtrudeGeometry }) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * spec.speed
    ref.current.rotation.x = t * spec.rot[0]
    ref.current.rotation.y = t * spec.rot[1]
    ref.current.position.y = spec.pos[1] + Math.sin(t * 0.9 + spec.pos[0]) * 0.35
  })
  const mat = useMemo(() => {
    switch (spec.kind) {
      case 'blue':
        return new THREE.MeshStandardMaterial({ color: '#0080ff', metalness: 0.55, roughness: 0.25 })
      case 'navy':
        return new THREE.MeshStandardMaterial({ color: '#00205b', metalness: 0.7, roughness: 0.3 })
      case 'cream':
        return new THREE.MeshStandardMaterial({ color: '#f1f1de', metalness: 0.15, roughness: 0.5 })
      case 'wire':
        return new THREE.MeshBasicMaterial({ color: '#0080ff', wireframe: true, transparent: true, opacity: 0.5 })
    }
  }, [spec.kind])
  return <mesh ref={ref} geometry={geo} material={mat} position={spec.pos} scale={spec.scale} />
}

function Scene() {
  const group = useRef<THREE.Group>(null!)
  const geo = useMemo(() => trapezoidGeometry(), [])
  useFrame(({ pointer }) => {
    // mouse parallax — the whole field leans toward the cursor
    group.current.rotation.y += (pointer.x * 0.22 - group.current.rotation.y) * 0.05
    group.current.rotation.x += (-pointer.y * 0.14 - group.current.rotation.x) * 0.05
  })
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} color="#ffffff" />
      <pointLight position={[-6, -4, 2]} intensity={1.2} color="#0080ff" />
      <group ref={group}>
        {SPECS.map((s, i) => (
          <Prism key={i} spec={s} geo={geo} />
        ))}
      </group>
      <fog attach="fog" args={['#000000', 6, 14]} />
    </>
  )
}

export default function Hero3D({ className = '' }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
