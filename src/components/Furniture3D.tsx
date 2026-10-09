import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

// Real 3D furniture re-skin: downloaded CC0 furniture (Poly Haven) whose
// surface is re-covered with an Alltak Decor pattern in real time, like the
// film applied over real furniture. Rotatable, studio-lit.

// Box-projected UVs: the downloaded models use an atlas UV layout (each part
// mapped to its own patch of the texture, at its own scale and rotation),
// which made the Alltak pattern come out at a different size and angle on
// every drawer. Instead, each triangle gets UVs from its world position,
// projected on the axis its face points to: fronts/sides use (horizontal, up)
// so wood grain and slats run vertically, tops use (x, z). Same scale on every
// face, continuous across edges, like a real film applied over the piece.
function projetarUVs(mesh: THREE.Mesh, tamanho: number) {
  const g = (mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone()) as THREE.BufferGeometry
  const pos = g.getAttribute('position')
  const uv = new Float32Array(pos.count * 2)
  const m = mesh.matrixWorld
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3()
  const n = new THREE.Vector3(), e1 = new THREE.Vector3(), e2 = new THREE.Vector3()
  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i).applyMatrix4(m)
    b.fromBufferAttribute(pos, i + 1).applyMatrix4(m)
    c.fromBufferAttribute(pos, i + 2).applyMatrix4(m)
    n.crossVectors(e1.subVectors(b, a), e2.subVectors(c, a))
    const ax = Math.abs(n.x), ay = Math.abs(n.y), az = Math.abs(n.z)
    ;[a, b, c].forEach((v, k) => {
      let u: number, w: number
      if (ay >= ax && ay >= az) [u, w] = [v.x, v.z] // tampo / base
      else if (ax >= az) [u, w] = [n.x > 0 ? -v.z : v.z, v.y] // laterais
      else [u, w] = [n.z > 0 ? v.x : -v.x, v.y] // frente / fundo
      // +0,5: o centro do móvel cai no meio da textura (painéis inteiros
      // ficam centrados, sem emenda no meio da frente)
      uv[(i + k) * 2] = u / tamanho + 0.5
      uv[(i + k) * 2 + 1] = w / tamanho + 0.5
    })
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  g.deleteAttribute('uv1')
  g.deleteAttribute('uv2')
  g.computeVertexNormals()
  mesh.geometry = g
}

function CabinetModel({ modelUrl, textureUrl, escala }: { modelUrl: string; textureUrl?: string; escala: number }) {
  const gltf = useLoader(GLTFLoader, modelUrl)
  const { gl } = useThree()
  const mat = useMemo(
    // filme vinílico: acabamento acetinado uniforme. Os mapas do modelo
    // (relevo/aspereza da madeira original) saem, pois estavam no atlas antigo
    () => new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.42, metalness: 0, envMapIntensity: 0.9 }),
    [],
  )

  const scene = useMemo(() => {
    const root = gltf.scene.clone(true)
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
    root.updateMatrixWorld(true)
    root.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh) return
      projetarUVs(mesh, escala)
      mesh.material = mat
    })
    return root
  }, [gltf, mat, escala])

  useEffect(() => {
    if (!textureUrl) return
    let vivo = true
    new THREE.TextureLoader().load(textureUrl, (tex) => {
      if (!vivo) return tex.dispose()
      tex.colorSpace = THREE.SRGBColorSpace
      // texturas de public/textures/decor-3d já repetem sem emenda; espelhar
      // criava losangos e chevrons que não existem no padrão
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping
      tex.anisotropy = gl.capabilities.getMaxAnisotropy()
      const antigo = mat.map
      mat.map = tex
      mat.needsUpdate = true
      antigo?.dispose()
    })
    return () => {
      vivo = false
    }
  }, [textureUrl, mat, gl])

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

// room: a closed box around the piece (floor + 4 walls), so orbiting all the
// way around never looks past the walls into empty background
function Room() {
  const shadow = useMemo(makeShadowTexture, [])
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#d7d2c8" roughness={0.95} metalness={0} />
      </mesh>
      {[0, 1, 2, 3].map((k) => (
        <mesh key={k} rotation={[0, (k * Math.PI) / 2, 0]} position={[Math.sin((k * Math.PI) / 2) * -8, 4, Math.cos((k * Math.PI) / 2) * -8]}>
          <planeGeometry args={[16, 8]} />
          <meshStandardMaterial color={k % 2 ? '#ddd8ce' : '#e7e3da'} roughness={1} metalness={0} />
        </mesh>
      ))}
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
    c.maxDistance = 6.5
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
  escala = 0.6,
  className = '',
}: {
  modelUrl: string
  textureUrl?: string
  /** tamanho de uma repetição da textura, em unidades da cena (~0,8 m cada) */
  escala?: number
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
        <CabinetModel modelUrl={modelUrl} textureUrl={textureUrl} escala={escala} />
      </Canvas>
    </div>
  )
}
