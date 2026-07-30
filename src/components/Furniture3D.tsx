import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

// Real 3D furniture re-skin: downloaded CC0 furniture (Poly Haven) whose
// surface is re-covered with an Alltak Decor pattern in real time — exactly
// what the adhesive does to real furniture. Rotatable, studio-lit.

function CabinetModel({ modelUrl, textureUrl }: { modelUrl: string; textureUrl?: string }) {
  const gltf = useLoader(GLTFLoader, modelUrl)
  const mats = useRef<THREE.MeshStandardMaterial[]>([])

  const scene = useMemo(() => {
    const root = gltf.scene.clone(true)
    const found: THREE.MeshStandardMaterial[] = []
    // center + scale to a consistent frame
    const box = new THREE.Box3().setFromObject(root)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    const s = 2.2 / Math.max(size.x, size.y, size.z)
    root.scale.setScalar(s)
    // center X/Z, rest the base on the floor (y = 0)
    root.position.set(-center.x * s, -box.min.y * s, -center.z * s)
    root.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh) return
      const m = mesh.material as THREE.MeshStandardMaterial
      if (m && !found.includes(m)) found.push(m)
    })
    mats.current = found
    return root
  }, [gltf])

  // re-skin: swap the base color map for the Alltak pattern, keep the model's
  // normal / roughness maps so the surface still reads as real material.
  useEffect(() => {
    if (!textureUrl) return
    const loader = new THREE.TextureLoader()
    loader.load(textureUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping
      // textureUrl is already a flat material crop, so just tile it lightly
      tex.repeat.set(2, 2)
      mats.current.forEach((m) => {
        m.map = tex
        m.color.set(0xffffff)
        m.needsUpdate = true
      })
    })
  }, [textureUrl])

  return <primitive object={scene} />
}

// soft round contact shadow under the furniture
function makeShadowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(64, 64, 4, 64, 64, 62)
  grad.addColorStop(0, 'rgba(0,0,0,0.55)')
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

// simple room: floor + corner walls so the piece reads as an ambiente
function Room() {
  const shadow = useMemo(makeShadowTexture, [])
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial color="#d7d2c8" roughness={0.95} metalness={0} />
      </mesh>
      <mesh position={[0, 5, -1.9]}>
        <planeGeometry args={[26, 12]} />
        <meshStandardMaterial color="#e7e3da" roughness={1} metalness={0} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-1.9, 5, 0]}>
        <planeGeometry args={[26, 12]} />
        <meshStandardMaterial color="#ddd8ce" roughness={1} metalness={0} />
      </mesh>
      {/* contact shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <planeGeometry args={[3.4, 3.4]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Rig() {
  const { camera, gl } = useThree()
  const controls = useRef<OrbitControls>()
  useEffect(() => {
    const c = new OrbitControls(camera, gl.domElement)
    c.enableDamping = true
    c.dampingFactor = 0.06
    c.autoRotate = true
    c.autoRotateSpeed = 1.0
    c.enablePan = false
    c.minDistance = 2.8
    c.maxDistance = 7.5
    c.maxPolarAngle = Math.PI / 2.05
    c.target.set(0, 0.9, 0)
    controls.current = c
    return () => c.dispose()
  }, [camera, gl])
  useFrame(() => controls.current?.update())
  return null
}

function StudioEnv() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    return () => {
      scene.environment = null
      env.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])
  return null
}

export default function Furniture3D({
  modelUrl,
  textureUrl,
  className = '',
}: {
  modelUrl: string
  textureUrl?: string
  className?: string
}) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: [3.6, 2.1, 3.9], fov: 42 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.98 }}
      >
        <StudioEnv />
        <Rig />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 4]} intensity={1.15} />
        <Room />
        <CabinetModel modelUrl={modelUrl} textureUrl={textureUrl} />
      </Canvas>
    </div>
  )
}
