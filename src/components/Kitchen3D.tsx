import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

// Full interactive 3D kitchen built with three.js primitives: base cabinets,
// island, oven tower, countertop, backsplash, floor and walls. The user orbits
// and zooms freely; clicking a surface selects it and the chosen Alltak Decor
// pattern is applied as its material map, PBR-lit for realism.

export type KitchenGroup = 'cima' | 'baixo' | 'bancada' | 'backsplash' | 'piso' | 'parede'

export const KITCHEN_GROUPS: { key: KitchenGroup; label: string }[] = [
  { key: 'cima', label: 'Armários de cima' },
  { key: 'baixo', label: 'Armários de baixo' },
  { key: 'bancada', label: 'Bancada' },
  { key: 'backsplash', label: 'Revestimento' },
  { key: 'parede', label: 'Parede' },
  { key: 'piso', label: 'Piso' },
]

type MatConf = { base: string; rough: number; metal: number; clearcoat: number; repeat: [number, number] }
const CONF: Record<KitchenGroup, MatConf> = {
  cima: { base: '#efe9dc', rough: 0.22, metal: 0.05, clearcoat: 0.7, repeat: [1, 1] },
  baixo: { base: '#4a4a4c', rough: 0.2, metal: 0.1, clearcoat: 0.8, repeat: [1, 1] },
  bancada: { base: '#cfc9bd', rough: 0.35, metal: 0.05, clearcoat: 0.25, repeat: [2, 2] },
  backsplash: { base: '#e8e4da', rough: 0.3, metal: 0.02, clearcoat: 0.35, repeat: [4, 1] },
  parede: { base: '#b9b4ab', rough: 0.95, metal: 0, clearcoat: 0, repeat: [3, 2] },
  piso: { base: '#b3a184', rough: 0.75, metal: 0, clearcoat: 0.05, repeat: [5, 5] },
}

type Mats = Record<KitchenGroup, THREE.MeshPhysicalMaterial>

function useMats(): Mats {
  return useMemo(() => {
    const m = {} as Mats
    ;(Object.keys(CONF) as KitchenGroup[]).forEach((k) => {
      const c = CONF[k]
      m[k] = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(c.base),
        roughness: c.rough,
        metalness: c.metal,
        clearcoat: c.clearcoat,
        clearcoatRoughness: 0.25,
      })
    })
    return m
  }, [])
}

// row of door fronts with even gaps
function Doors({
  n, width, h, y, z, mat, x0 = 0, gap = 0.018,
}: { n: number; width: number; h: number; y: number; z: number; mat: THREE.Material; x0?: number; gap?: number }) {
  const w = (width - gap * (n + 1)) / n
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const x = x0 - width / 2 + gap + w / 2 + i * (w + gap)
        return (
          <mesh key={i} material={mat} position={[x, y, z]} castShadow receiveShadow>
            <boxGeometry args={[w, h, 0.02]} />
          </mesh>
        )
      })}
    </>
  )
}

function Handles({
  n, width, y, z, x0 = 0, gap = 0.018, mat,
}: { n: number; width: number; y: number; z: number; x0?: number; gap?: number; mat: THREE.Material }) {
  const w = (width - gap * (n + 1)) / n
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const x = x0 - width / 2 + gap + w / 2 + i * (w + gap)
        return (
          <mesh key={i} material={mat} position={[x, y, z]} castShadow>
            <boxGeometry args={[Math.min(0.3, w * 0.5), 0.018, 0.018]} />
          </mesh>
        )
      })}
    </>
  )
}

function Scene({ mats, onSelect }: { mats: Mats; onSelect: (g: KitchenGroup) => void }) {
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x141518, roughness: 0.35, metalness: 0.6 }), [])
  const steel = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x9aa0a6, roughness: 0.25, metalness: 1 }), [])
  const black = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: 0x0b0c0f, roughness: 0.15, metalness: 0.4, clearcoat: 1 }),
    [],
  )
  const glow = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0xfff1d6, emissive: 0xffe2ae, emissiveIntensity: 1.6 }),
    [],
  )

  const pick = (g: KitchenGroup) => ({
    onClick: (e: any) => {
      e.stopPropagation()
      onSelect(g)
    },
    onPointerOver: (e: any) => {
      e.stopPropagation()
      document.body.style.cursor = 'pointer'
    },
    onPointerOut: () => {
      document.body.style.cursor = ''
    },
  })

  return (
    <group>
      {/* room */}
      <mesh material={mats.piso} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1.2]} receiveShadow {...pick('piso')}>
        <planeGeometry args={[10, 9]} />
      </mesh>
      <mesh material={mats.parede} position={[0, 1.7, -2.21]} receiveShadow {...pick('parede')}>
        <planeGeometry args={[10, 3.4]} />
      </mesh>
      <mesh material={mats.parede} rotation={[0, Math.PI / 2, 0]} position={[-3.6, 1.7, 1.2]} receiveShadow {...pick('parede')}>
        <planeGeometry args={[9, 3.4]} />
      </mesh>

      {/* base cabinets */}
      <group {...pick('baixo')}>
        <mesh material={dark} position={[0, 0.05, -1.95]}>
          <boxGeometry args={[4.3, 0.1, 0.5]} />
        </mesh>
        <mesh material={mats.baixo} position={[0, 0.49, -1.9]} castShadow receiveShadow>
          <boxGeometry args={[4.4, 0.78, 0.6]} />
        </mesh>
        <Doors n={5} width={4.4} h={0.7} y={0.51} z={-1.59} mat={mats.baixo} />
      </group>
      <Handles n={5} width={4.4} y={0.8} z={-1.575} mat={dark} />

      {/* countertop + hob + sink */}
      <group {...pick('bancada')}>
        <mesh material={mats.bancada} position={[0, 0.905, -1.89]} castShadow receiveShadow>
          <boxGeometry args={[4.6, 0.05, 0.66]} />
        </mesh>
      </group>
      <mesh material={black} position={[1.15, 0.936, -1.89]}>
        <boxGeometry args={[0.85, 0.012, 0.5]} />
      </mesh>
      <mesh material={steel} position={[-1.25, 0.934, -1.89]}>
        <boxGeometry args={[0.7, 0.008, 0.44]} />
      </mesh>
      {/* faucet */}
      <mesh material={steel} position={[-1.25, 1.05, -2.09]}>
        <cylinderGeometry args={[0.015, 0.015, 0.24, 12]} />
      </mesh>
      <mesh material={steel} position={[-1.25, 1.17, -2.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.013, 0.013, 0.16, 12]} />
      </mesh>

      {/* backsplash */}
      <group {...pick('backsplash')}>
        <mesh material={mats.backsplash} position={[0, 1.24, -2.18]} receiveShadow>
          <boxGeometry args={[4.6, 0.62, 0.03]} />
        </mesh>
      </group>
      {/* under-cabinet light strip */}
      <mesh material={glow} position={[0, 1.555, -1.87]}>
        <boxGeometry args={[4.3, 0.018, 0.03]} />
      </mesh>

      {/* upper cabinets */}
      <group {...pick('cima')}>
        <mesh material={mats.cima} position={[0, 1.9, -2.02]} castShadow receiveShadow>
          <boxGeometry args={[4.4, 0.7, 0.35]} />
        </mesh>
        <Doors n={4} width={4.4} h={0.66} y={1.9} z={-1.835} mat={mats.cima} />
      </group>

      {/* oven tower */}
      <group {...pick('baixo')}>
        <mesh material={mats.baixo} position={[2.75, 1.125, -1.875]} castShadow receiveShadow>
          <boxGeometry args={[0.75, 2.25, 0.65]} />
        </mesh>
      </group>
      <mesh material={black} position={[2.75, 1.66, -1.54]}>
        <boxGeometry args={[0.62, 0.42, 0.02]} />
      </mesh>
      <mesh material={steel} position={[2.75, 1.5, -1.525]}>
        <boxGeometry args={[0.56, 0.02, 0.02]} />
      </mesh>
      <mesh material={black} position={[2.75, 1.16, -1.54]}>
        <boxGeometry args={[0.62, 0.34, 0.02]} />
      </mesh>

      {/* island */}
      <group {...pick('baixo')}>
        <mesh material={dark} position={[0, 0.05, 0.65]}>
          <boxGeometry args={[2.2, 0.1, 0.75]} />
        </mesh>
        <mesh material={mats.baixo} position={[0, 0.49, 0.65]} castShadow receiveShadow>
          <boxGeometry args={[2.3, 0.78, 0.85]} />
        </mesh>
        <Doors n={3} width={2.3} h={0.68} y={0.5} z={1.086} mat={mats.baixo} />
      </group>
      <Handles n={3} width={2.3} y={0.78} z={1.1} mat={dark} />
      <group {...pick('bancada')}>
        <mesh material={mats.bancada} position={[0, 0.905, 0.65]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.05, 1.0]} />
        </mesh>
      </group>
    </group>
  )
}

function Rig() {
  const { camera, gl } = useThree()
  const controls = useRef<OrbitControls>()
  useEffect(() => {
    const c = new OrbitControls(camera, gl.domElement)
    c.enableDamping = true
    c.dampingFactor = 0.07
    c.enablePan = false
    c.minDistance = 2.2
    c.maxDistance = 9
    c.maxPolarAngle = Math.PI / 2.02
    c.target.set(0, 1.0, -0.4)
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

export default function Kitchen3D({
  textures,
  selected,
  onSelect,
  className = '',
}: {
  textures: Partial<Record<KitchenGroup, string>>
  selected: KitchenGroup
  onSelect: (g: KitchenGroup) => void
  className?: string
}) {
  const mats = useMats()

  // apply/remove pattern maps per group
  useEffect(() => {
    ;(Object.keys(CONF) as KitchenGroup[]).forEach((k) => {
      const url = textures[k]
      const mat = mats[k]
      if (!url) {
        mat.map = null
        mat.color.set(CONF[k].base)
        mat.needsUpdate = true
        return
      }
      new THREE.TextureLoader().load(url, (t) => {
        t.colorSpace = THREE.SRGBColorSpace
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        t.repeat.set(...CONF[k].repeat)
        t.anisotropy = 8
        mat.map = t
        mat.color.set('#ffffff')
        mat.needsUpdate = true
      })
    })
  }, [textures, mats])

  // selection highlight
  useEffect(() => {
    ;(Object.keys(CONF) as KitchenGroup[]).forEach((k) => {
      const mat = mats[k]
      if (k === selected) {
        mat.emissive = new THREE.Color('#0080ff')
        mat.emissiveIntensity = 0.16
      } else {
        mat.emissive = new THREE.Color('#000000')
        mat.emissiveIntensity = 0
      }
      mat.needsUpdate = true
    })
  }, [selected, mats])

  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ position: [3.4, 2.2, 4.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
      >
        <StudioEnv />
        <Rig />
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[4, 6, 3]}
          intensity={1.3}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
        />
        <Scene mats={mats} onSelect={onSelect} />
      </Canvas>
    </div>
  )
}
