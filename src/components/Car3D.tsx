import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import type { FinishKey } from '../data/visualizer'

// Real-time 3D wrap preview: photoreal sports-car GLB (draco), studio
// environment reflections, physically-based paint driven by finish + color.
// Model: three.js examples sports car (CC-BY — credit shown in the page).

const MODEL_URL = './models/car.glb'
const AO_URL = './models/car_ao.png'

// carbon-weave texture generated on a tiny canvas
function makeCarbonTexture(color: string) {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  g.fillStyle = color
  g.fillRect(0, 0, 64, 64)
  g.fillStyle = 'rgba(255,255,255,0.10)'
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < 8; x++) if ((x + y) % 2 === 0) g.fillRect(x * 8, y * 8, 8, 8)
  g.fillStyle = 'rgba(0,0,0,0.35)'
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < 8; x++) if ((x + y) % 2 === 1) g.fillRect(x * 8, y * 8, 8, 8)
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(24, 24)
  return tex
}

function paintFor(finish: FinishKey, color: string, shift?: string) {
  const base: THREE.MeshPhysicalMaterialParameters = { color: new THREE.Color(color) }
  switch (finish) {
    case 'brilho':
      return { ...base, metalness: 0.55, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.03 }
    case 'fosco':
      return { ...base, metalness: 0.15, roughness: 0.82, clearcoat: 0, clearcoatRoughness: 0.8 }
    case 'acetinado':
      return { ...base, metalness: 0.35, roughness: 0.45, clearcoat: 0.35, clearcoatRoughness: 0.35 }
    case 'metalico':
      return { ...base, metalness: 1.0, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.08 }
    case 'cromado':
      return { ...base, metalness: 1.0, roughness: 0.04, clearcoat: 1, clearcoatRoughness: 0.02 }
    case 'carbono':
      return {
        ...base,
        map: makeCarbonTexture(color),
        metalness: 0.5,
        roughness: 0.35,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      }
    case 'camaleao':
      return {
        ...base,
        metalness: 0.75,
        roughness: 0.25,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        iridescence: 1,
        iridescenceIOR: 1.6,
        sheen: 1,
        sheenColor: new THREE.Color(shift ?? color),
      }
  }
}

function CarModel({ finish, color, shift }: { finish: FinishKey; color: string; shift?: string }) {
  const gltf = useLoader(GLTFLoader, MODEL_URL, (loader) => {
    const draco = new DRACOLoader()
    draco.setDecoderPath('./draco/')
    ;(loader as GLTFLoader).setDRACOLoader(draco)
  })
  const aoTex = useLoader(THREE.TextureLoader, AO_URL)

  const body = useRef<THREE.MeshPhysicalMaterial>()
  const scene = useMemo(() => {
    const car = gltf.scene.clone(true)
    const bodyMat = new THREE.MeshPhysicalMaterial()
    const details = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 1.0, roughness: 0.4 })
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0x0b0f14,
      metalness: 0.25,
      roughness: 0.05,
      transmission: 0.3,
      transparent: true,
      opacity: 0.92,
    })
    car.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh) return
      // this GLB identifies parts by OBJECT name (body, rim_*, trim, glass)
      const oName = mesh.name.toLowerCase()
      const mName = ((mesh.material as THREE.Material)?.name ?? '').toLowerCase()
      const n = oName + ' ' + mName
      if (n.includes('body') || n.includes('paint') || n.includes('carroceria')) mesh.material = bodyMat
      else if (n.includes('glass') || n.includes('vidro') || n.includes('window')) mesh.material = glass
      else if (n.includes('rim') || n.includes('trim') || n.includes('wheel') || n.includes('grille')) mesh.material = details
    })
    // soft baked shadow under the car
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
      new THREE.MeshBasicMaterial({ map: aoTex, blending: THREE.MultiplyBlending, toneMapped: false, transparent: true }),
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.renderOrder = 2
    car.add(shadow)
    body.current = bodyMat
    return car
  }, [gltf, aoTex])

  // apply finish/color whenever they change
  useEffect(() => {
    const mat = body.current
    if (!mat) return
    const params = paintFor(finish, color, shift)
    mat.setValues(params as THREE.MeshPhysicalMaterialParameters)
    if (finish !== 'carbono') mat.map = null
    mat.needsUpdate = true
  }, [finish, color, shift, scene])

  return <primitive object={scene} />
}

function Rig() {
  const { camera, gl } = useThree()
  const controls = useRef<OrbitControls>()
  useEffect(() => {
    const c = new OrbitControls(camera, gl.domElement)
    c.enableDamping = true
    c.dampingFactor = 0.06
    c.autoRotate = true
    c.autoRotateSpeed = 1.1
    c.enablePan = false
    c.minDistance = 3.2
    c.maxDistance = 8
    c.maxPolarAngle = Math.PI / 2.05
    c.target.set(0, 0.5, 0)
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

export default function Car3D({
  finish,
  color,
  shift,
  className = '',
}: {
  finish: FinishKey
  color: string
  shift?: string
  className?: string
}) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: [4.2, 1.5, 4.2], fov: 38 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.9 }}
      >
        <StudioEnv />
        <Rig />
        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 8, 4]} intensity={1.2} />
        <CarModel finish={finish} color={color} shift={shift} />
      </Canvas>
    </div>
  )
}
