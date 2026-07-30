import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

// Interactive 3D rooms (kitchen / living room / bedroom) built with three.js
// primitives. The user orbits and zooms freely; clicking a surface selects it
// and the chosen Alltak Decor pattern becomes that surface's PBR material.

export type RoomKey = 'cozinha' | 'sala' | 'quarto'

export type GroupDef = {
  key: string
  label: string
  base: string
  rough: number
  metal: number
  clearcoat: number
  repeat: [number, number]
}

export const ROOMS: Record<
  RoomKey,
  { label: string; cam: [number, number, number]; target: [number, number, number]; groups: GroupDef[] }
> = {
  cozinha: {
    label: 'Cozinha',
    cam: [3.4, 2.2, 4.2],
    target: [0, 1.0, -0.4],
    groups: [
      { key: 'cima', label: 'Armários de cima', base: '#efe9dc', rough: 0.22, metal: 0.05, clearcoat: 0.7, repeat: [1, 1] },
      { key: 'baixo', label: 'Armários de baixo', base: '#4a4a4c', rough: 0.2, metal: 0.1, clearcoat: 0.8, repeat: [1, 1] },
      { key: 'bancada', label: 'Bancada', base: '#cfc9bd', rough: 0.35, metal: 0.05, clearcoat: 0.25, repeat: [2, 2] },
      { key: 'backsplash', label: 'Revestimento', base: '#e8e4da', rough: 0.3, metal: 0.02, clearcoat: 0.35, repeat: [4, 1] },
      { key: 'parede', label: 'Parede', base: '#b9b4ab', rough: 0.95, metal: 0, clearcoat: 0, repeat: [3, 2] },
      { key: 'piso', label: 'Piso', base: '#b3a184', rough: 0.75, metal: 0, clearcoat: 0.05, repeat: [5, 5] },
    ],
  },
  sala: {
    label: 'Sala',
    cam: [3.4, 2.0, 4.4],
    target: [0, 1.0, -0.2],
    groups: [
      { key: 'painel', label: 'Painel da TV', base: '#8a6f52', rough: 0.4, metal: 0.02, clearcoat: 0.3, repeat: [3, 2] },
      { key: 'rack', label: 'Rack', base: '#3e4044', rough: 0.25, metal: 0.08, clearcoat: 0.7, repeat: [1, 1] },
      { key: 'mesa', label: 'Mesa de centro', base: '#7a6a55', rough: 0.35, metal: 0.05, clearcoat: 0.4, repeat: [1, 1] },
      { key: 'parede', label: 'Parede', base: '#b6b1a8', rough: 0.95, metal: 0, clearcoat: 0, repeat: [3, 2] },
      { key: 'piso', label: 'Piso', base: '#a9987b', rough: 0.75, metal: 0, clearcoat: 0.05, repeat: [5, 5] },
    ],
  },
  quarto: {
    label: 'Quarto',
    cam: [3.4, 2.2, 4.0],
    target: [0, 1.0, -0.5],
    groups: [
      { key: 'cabeceira', label: 'Cabeceira', base: '#84674b', rough: 0.45, metal: 0.02, clearcoat: 0.25, repeat: [3, 2] },
      { key: 'guarda', label: 'Guarda-roupa', base: '#565a5e', rough: 0.22, metal: 0.08, clearcoat: 0.7, repeat: [1, 1] },
      { key: 'criado', label: 'Criados-mudos', base: '#4c4e52', rough: 0.25, metal: 0.08, clearcoat: 0.6, repeat: [1, 1] },
      { key: 'parede', label: 'Parede', base: '#b4afa5', rough: 0.95, metal: 0, clearcoat: 0, repeat: [3, 2] },
      { key: 'piso', label: 'Piso', base: '#ab9a7e', rough: 0.75, metal: 0, clearcoat: 0.05, repeat: [5, 5] },
    ],
  },
}

type Mats = Record<string, THREE.MeshPhysicalMaterial>

function buildMats(room: RoomKey): Mats {
  const m: Mats = {}
  ROOMS[room].groups.forEach((g) => {
    m[g.key] = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(g.base),
      roughness: g.rough,
      metalness: g.metal,
      clearcoat: g.clearcoat,
      clearcoatRoughness: 0.25,
    })
  })
  return m
}

// ---------- shared static materials + helpers ----------

function useStatics() {
  return useMemo(
    () => ({
      dark: new THREE.MeshStandardMaterial({ color: 0x141518, roughness: 0.35, metalness: 0.6 }),
      steel: new THREE.MeshStandardMaterial({ color: 0x9aa0a6, roughness: 0.25, metalness: 1 }),
      black: new THREE.MeshPhysicalMaterial({ color: 0x0b0c0f, roughness: 0.15, metalness: 0.4, clearcoat: 1 }),
      glow: new THREE.MeshStandardMaterial({ color: 0xfff1d6, emissive: 0xffe2ae, emissiveIntensity: 1.6 }),
      fabric: new THREE.MeshStandardMaterial({ color: 0x5b6169, roughness: 1 }),
      fabricLight: new THREE.MeshStandardMaterial({ color: 0xe9e4d8, roughness: 1 }),
      leaf: new THREE.MeshStandardMaterial({ color: 0x3c6b3a, roughness: 1 }),
      rug: new THREE.MeshStandardMaterial({ color: 0xd8d2c4, roughness: 1 }),
    }),
    [],
  )
}

type Pick = (g: string) => {
  onClick: (e: any) => void
  onPointerOver: (e: any) => void
  onPointerOut: () => void
}

function usePick(onSelect: (g: string) => void): Pick {
  return (g: string) => ({
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
}

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

function Shell({ mats, pick }: { mats: Mats; pick: Pick }) {
  return (
    <>
      <mesh material={mats.piso} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1.2]} receiveShadow {...pick('piso')}>
        <planeGeometry args={[10, 9]} />
      </mesh>
      <mesh material={mats.parede} position={[0, 1.7, -2.21]} receiveShadow {...pick('parede')}>
        <planeGeometry args={[10, 3.4]} />
      </mesh>
      <mesh material={mats.parede} rotation={[0, Math.PI / 2, 0]} position={[-3.6, 1.7, 1.2]} receiveShadow {...pick('parede')}>
        <planeGeometry args={[9, 3.4]} />
      </mesh>
    </>
  )
}

// ---------- scenes ----------

function Kitchen({ mats, pick, st }: { mats: Mats; pick: Pick; st: ReturnType<typeof useStatics> }) {
  return (
    <group>
      <Shell mats={mats} pick={pick} />

      {/* base cabinets */}
      <group {...pick('baixo')}>
        <mesh material={st.dark} position={[0, 0.05, -1.95]}>
          <boxGeometry args={[4.3, 0.1, 0.5]} />
        </mesh>
        <mesh material={mats.baixo} position={[0, 0.49, -1.9]} castShadow receiveShadow>
          <boxGeometry args={[4.4, 0.78, 0.6]} />
        </mesh>
        <Doors n={5} width={4.4} h={0.7} y={0.51} z={-1.59} mat={mats.baixo} />
      </group>
      <Handles n={5} width={4.4} y={0.8} z={-1.575} mat={st.dark} />

      {/* countertop + hob + sink + faucet */}
      <group {...pick('bancada')}>
        <mesh material={mats.bancada} position={[0, 0.905, -1.89]} castShadow receiveShadow>
          <boxGeometry args={[4.6, 0.05, 0.66]} />
        </mesh>
      </group>
      <mesh material={st.black} position={[1.15, 0.936, -1.89]}>
        <boxGeometry args={[0.85, 0.012, 0.5]} />
      </mesh>
      <mesh material={st.steel} position={[-1.25, 0.934, -1.89]}>
        <boxGeometry args={[0.7, 0.008, 0.44]} />
      </mesh>
      <mesh material={st.steel} position={[-1.25, 1.05, -2.09]}>
        <cylinderGeometry args={[0.015, 0.015, 0.24, 12]} />
      </mesh>
      <mesh material={st.steel} position={[-1.25, 1.17, -2.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.013, 0.013, 0.16, 12]} />
      </mesh>

      {/* backsplash + light strip */}
      <group {...pick('backsplash')}>
        <mesh material={mats.backsplash} position={[0, 1.24, -2.18]} receiveShadow>
          <boxGeometry args={[4.6, 0.62, 0.03]} />
        </mesh>
      </group>
      <mesh material={st.glow} position={[0, 1.555, -1.87]}>
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
      <mesh material={st.black} position={[2.75, 1.66, -1.54]}>
        <boxGeometry args={[0.62, 0.42, 0.02]} />
      </mesh>
      <mesh material={st.steel} position={[2.75, 1.5, -1.525]}>
        <boxGeometry args={[0.56, 0.02, 0.02]} />
      </mesh>
      <mesh material={st.black} position={[2.75, 1.16, -1.54]}>
        <boxGeometry args={[0.62, 0.34, 0.02]} />
      </mesh>

      {/* island */}
      <group {...pick('baixo')}>
        <mesh material={st.dark} position={[0, 0.05, 0.65]}>
          <boxGeometry args={[2.2, 0.1, 0.75]} />
        </mesh>
        <mesh material={mats.baixo} position={[0, 0.49, 0.65]} castShadow receiveShadow>
          <boxGeometry args={[2.3, 0.78, 0.85]} />
        </mesh>
        <Doors n={3} width={2.3} h={0.68} y={0.5} z={1.086} mat={mats.baixo} />
      </group>
      <Handles n={3} width={2.3} y={0.78} z={1.1} mat={st.dark} />
      <group {...pick('bancada')}>
        <mesh material={mats.bancada} position={[0, 0.905, 0.65]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.05, 1.0]} />
        </mesh>
      </group>
    </group>
  )
}

function Living({ mats, pick, st }: { mats: Mats; pick: Pick; st: ReturnType<typeof useStatics> }) {
  return (
    <group>
      <Shell mats={mats} pick={pick} />

      {/* feature wall panel behind the TV */}
      <group {...pick('painel')}>
        <mesh material={mats.painel} position={[0, 1.55, -2.17]} castShadow receiveShadow>
          <boxGeometry args={[4.6, 2.7, 0.06]} />
        </mesh>
      </group>

      {/* TV */}
      <mesh material={st.black} position={[0, 1.65, -2.1]} castShadow>
        <boxGeometry args={[1.75, 0.98, 0.05]} />
      </mesh>

      {/* rack under the TV */}
      <group {...pick('rack')}>
        <mesh material={st.dark} position={[0, 0.05, -1.9]}>
          <boxGeometry args={[2.9, 0.1, 0.42]} />
        </mesh>
        <mesh material={mats.rack} position={[0, 0.32, -1.88]} castShadow receiveShadow>
          <boxGeometry args={[3.0, 0.44, 0.5]} />
        </mesh>
        <Doors n={4} width={3.0} h={0.36} y={0.32} z={-1.62} mat={mats.rack} />
      </group>
      <Handles n={4} width={3.0} y={0.44} z={-1.605} mat={st.dark} />

      {/* rug */}
      <mesh material={st.rug} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0.5]} receiveShadow>
        <planeGeometry args={[3.4, 2.4]} />
      </mesh>

      {/* coffee table */}
      <group {...pick('mesa')}>
        <mesh material={mats.mesa} position={[0, 0.4, 0.35]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.05, 0.6]} />
        </mesh>
        {[-0.52, 0.52].map((x) =>
          [0.12, 0.58].map((z) => (
            <mesh key={`${x}-${z}`} material={mats.mesa} position={[x, 0.19, z]} castShadow>
              <boxGeometry args={[0.05, 0.38, 0.05]} />
            </mesh>
          )),
        )}
      </group>

      {/* sofa facing the TV */}
      <group>
        <mesh material={st.fabric} position={[0, 0.32, 1.65]} castShadow receiveShadow>
          <boxGeometry args={[2.6, 0.42, 1.0]} />
        </mesh>
        <mesh material={st.fabric} position={[0, 0.75, 2.05]} castShadow>
          <boxGeometry args={[2.6, 0.6, 0.28]} />
        </mesh>
        {[-1.42, 1.42].map((x) => (
          <mesh key={x} material={st.fabric} position={[x, 0.55, 1.65]} castShadow>
            <boxGeometry args={[0.24, 0.5, 1.0]} />
          </mesh>
        ))}
        {[-0.85, 0, 0.85].map((x) => (
          <mesh key={x} material={st.fabricLight} position={[x, 0.58, 1.55]} castShadow>
            <boxGeometry args={[0.78, 0.14, 0.75]} />
          </mesh>
        ))}
      </group>

      {/* floor lamp */}
      <mesh material={st.dark} position={[2.4, 0.7, 1.7]}>
        <cylinderGeometry args={[0.018, 0.018, 1.4, 10]} />
      </mesh>
      <mesh material={st.glow} position={[2.4, 1.48, 1.7]}>
        <cylinderGeometry args={[0.16, 0.2, 0.24, 16]} />
      </mesh>

      {/* plant */}
      <mesh material={st.dark} position={[-2.9, 0.16, -1.6]}>
        <cylinderGeometry args={[0.2, 0.16, 0.32, 14]} />
      </mesh>
      <mesh material={st.leaf} position={[-2.9, 0.62, -1.6]}>
        <sphereGeometry args={[0.34, 12, 10]} />
      </mesh>
      <mesh material={st.leaf} position={[-2.75, 0.85, -1.55]}>
        <sphereGeometry args={[0.22, 12, 10]} />
      </mesh>
    </group>
  )
}

function Bedroom({ mats, pick, st }: { mats: Mats; pick: Pick; st: ReturnType<typeof useStatics> }) {
  return (
    <group>
      <Shell mats={mats} pick={pick} />

      {/* headboard feature panel */}
      <group {...pick('cabeceira')}>
        <mesh material={mats.cabeceira} position={[-0.4, 1.15, -2.17]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 1.5, 0.06]} />
        </mesh>
      </group>

      {/* bed */}
      <group>
        <mesh material={st.dark} position={[-0.4, 0.18, -1.05]} castShadow>
          <boxGeometry args={[1.85, 0.24, 2.15]} />
        </mesh>
        <mesh material={st.fabricLight} position={[-0.4, 0.42, -1.05]} castShadow receiveShadow>
          <boxGeometry args={[1.75, 0.24, 2.05]} />
        </mesh>
        {/* duvet over the front half */}
        <mesh material={st.rug} position={[-0.4, 0.55, -0.65]} castShadow>
          <boxGeometry args={[1.78, 0.1, 1.15]} />
        </mesh>
        {/* pillows */}
        {[-0.82, 0.02].map((x) => (
          <mesh key={x} material={st.fabricLight} position={[x, 0.62, -1.85]} rotation={[-0.25, 0, 0]} castShadow>
            <boxGeometry args={[0.7, 0.16, 0.42]} />
          </mesh>
        ))}
      </group>

      {/* nightstands + lamps */}
      <group {...pick('criado')}>
        {[-1.75, 0.95].map((x) => (
          <mesh key={x} material={mats.criado} position={[x, 0.28, -1.85]} castShadow receiveShadow>
            <boxGeometry args={[0.5, 0.44, 0.45]} />
          </mesh>
        ))}
      </group>
      {[-1.75, 0.95].map((x) => (
        <group key={x}>
          <mesh material={st.dark} position={[x, 0.55, -1.85]}>
            <cylinderGeometry args={[0.035, 0.05, 0.1, 12]} />
          </mesh>
          <mesh material={st.glow} position={[x, 0.68, -1.85]}>
            <cylinderGeometry args={[0.09, 0.11, 0.14, 14]} />
          </mesh>
        </group>
      ))}

      {/* wardrobe on the right */}
      <group {...pick('guarda')}>
        <mesh material={mats.guarda} position={[2.35, 1.2, -1.87]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 2.4, 0.65]} />
        </mesh>
        {[-0.49, 0.51].map((x) => (
          <mesh key={x} material={mats.guarda} position={[2.35 + x, 1.2, -1.53]} castShadow>
            <boxGeometry args={[0.94, 2.3, 0.02]} />
          </mesh>
        ))}
      </group>
      {[-0.04, 0.06].map((x) => (
        <mesh key={x} material={st.dark} position={[2.35 + x, 1.2, -1.515]}>
          <boxGeometry args={[0.02, 0.5, 0.02]} />
        </mesh>
      ))}

      {/* rug */}
      <mesh material={st.rug} rotation={[-Math.PI / 2, 0, 0]} position={[-0.4, 0.005, 0.4]} receiveShadow>
        <planeGeometry args={[2.8, 1.6]} />
      </mesh>
    </group>
  )
}

// ---------- rig / env / root ----------

function Rig({ cam, target }: { cam: [number, number, number]; target: [number, number, number] }) {
  const { camera, gl } = useThree()
  const controls = useRef<OrbitControls>()
  useEffect(() => {
    camera.position.set(...cam)
    const c = new OrbitControls(camera, gl.domElement)
    c.enableDamping = true
    c.dampingFactor = 0.07
    c.enablePan = false
    c.minDistance = 2.2
    c.maxDistance = 9
    c.maxPolarAngle = Math.PI / 2.02
    c.target.set(...target)
    controls.current = c
    return () => c.dispose()
  }, [camera, gl, cam, target])
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

export default function Room3D({
  room,
  textures,
  selected,
  onSelect,
  className = '',
}: {
  room: RoomKey
  textures: Partial<Record<string, string>>
  selected: string
  onSelect: (g: string) => void
  className?: string
}) {
  const mats = useMemo(() => buildMats(room), [room])
  const st = useStatics()
  const pick = usePick(onSelect)
  const conf = ROOMS[room]

  // apply/remove pattern maps per group
  useEffect(() => {
    conf.groups.forEach((g) => {
      const url = textures[g.key]
      const mat = mats[g.key]
      if (!url) {
        mat.map = null
        mat.color.set(g.base)
        mat.needsUpdate = true
        return
      }
      new THREE.TextureLoader().load(url, (t) => {
        t.colorSpace = THREE.SRGBColorSpace
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        t.repeat.set(...g.repeat)
        t.anisotropy = 8
        mat.map = t
        mat.color.set('#ffffff')
        mat.needsUpdate = true
      })
    })
  }, [textures, mats, conf])

  // selection highlight
  useEffect(() => {
    conf.groups.forEach((g) => {
      const mat = mats[g.key]
      if (g.key === selected) {
        mat.emissive = new THREE.Color('#0080ff')
        mat.emissiveIntensity = 0.16
      } else {
        mat.emissive = new THREE.Color('#000000')
        mat.emissiveIntensity = 0
      }
      mat.needsUpdate = true
    })
  }, [selected, mats, conf])

  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ position: conf.cam, fov: 42 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
      >
        <StudioEnv />
        <Rig cam={conf.cam} target={conf.target} />
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
        {room === 'cozinha' && <Kitchen mats={mats} pick={pick} st={st} />}
        {room === 'sala' && <Living mats={mats} pick={pick} st={st} />}
        {room === 'quarto' && <Bedroom mats={mats} pick={pick} st={st} />}
      </Canvas>
    </div>
  )
}
