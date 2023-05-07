import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { TextureLoader } from 'three/src/loaders/TextureLoader'

// This sandbox shows how to prgressively load an asset through nested suspense blocks
// 1. A generic fallback
// 2. Lesser resolution
// 3. High resolution

export default function Suspense() {
  return (
    <Suspense fallback={<span>loading...</span>}>
      <Canvas dpr={[1, 2]} camera={{ position: [-2, 2, 4], fov: 25 }}>
        <directionalLight position={[10, 10, 0]} intensity={1.5} />
        <directionalLight position={[-10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, 20, 0]} intensity={1.5} />
        <directionalLight position={[0, -10, 0]} intensity={0.25} />
        <Rotate position-y={-0.5} scale={0.2}>
          <Suspense fallback={<Model url="/bust-lo-draco.glb" />}>
            <Model url="/bust-hi.glb" />
          </Suspense>
        </Rotate>
      </Canvas>
    </Suspense>
  )
}

function Model({ url, ...props }) {
  // useGLTF suspends the component, it literally stops processing
  const { scene } = useGLTF(url)
  // By the time we're here the model is gueranteed to be available
  return <primitive object={scene} {...props} />
}

function Rotate(props) {
  const ref = useRef()
  useFrame((state) => (ref.current.rotation.y = state.clock.elapsedTime))
  return <group ref={ref} {...props} />
}

function Cubemap() {
  // all texture
  //const texture = useLoader(TextureLoader, '/images/front_texture')
  //const texture1 = useLoader(TextureLoader, '/images/back_texture')
  const [map1, map2] = useLoader(TextureLoader, ['/image.jpg', '/image2.png'])
  return (
    <mesh>
      <boxGeometry args={[10, 10, 10]} />
      <meshBasicMaterial attach="material-0" color="0xffffff" /> {/* px */}
      <meshBasicMaterial attach="material-1" color="0xffffff" /> {/* nx */}
      <meshBasicMaterial attach="material-2" color="0xffffff" /> {/* py */}
      <meshBasicMaterial attach="material-3" color="0xffffff" /> {/* ny */}
      <meshBasicMaterial attach="material-4" map={map1} transparent /> {/* pz */}
      <meshBasicMaterial attach="material-5" map={map2} transparent /> {/* nz */}
    </mesh>
  )
}
//got to do for cubemap face which would go inside the cubemap
