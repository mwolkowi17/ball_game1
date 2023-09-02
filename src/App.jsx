import { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier"
import * as THREE from "three"

function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += delta))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <directionalLight />
      <pointLight position={[-10, -10, -10]} />
      {/* <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} /> */}
      {/* <OrbitControls /> */}
      <Physics gravity={[0, -30, 0]}>
        <Ball />
        <Paddle />
        <Enemy color="orange" position={[2.75, 1.5, 0]} />
        <Enemy color="hotpink" position={[-2.75, 3.5, 0]} />
      </Physics>
    </Canvas>
  )
}








//= ======================================================================
// import * as THREE from "three"
// import { Canvas, useFrame, useThree } from "@react-three/fiber"
// import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier"
// import { useRef } from "react"

// export default function App() {
//   <Canvas camera={{ position: [0, 5, 12], fov: 50 }}>
//     <ambientLight intensity={0.5} />
//     <pointLight position={[10, 10, 5]} />
//     <mesh position={[0,0,0]}>
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color={'orange'} />
//     </mesh>
//     {/* <Physics gravity={[0, -30, 0]}>
//       <Ball />
//       <Paddle />
//       <Enemy color="orange" position={[2.75, 1.5, 0]} />
//       <Enemy color="hotpink" position={[-2.75, 3.5, 0]} />
//     </Physics> */}
//   </Canvas>
// }

function Ball() {
  const ref = useRef()
  const { viewport } = useThree()
  const onCollisionEnter = () => (ref.current.setTranslation({ x: 0, y: 0, z: 0 }), ref.current.setLinvel({ x: 0, y: 10, z: 0 }))
  return (
    <>
      <RigidBody ref={ref} colliders="ball" mass={1}>
        <mesh>
          <sphereGeometry args={[0.75, 32, 32]} />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders={false} position={[0, -viewport.height, 0]} restitution={2.1} onCollisionEnter={onCollisionEnter}>
        <CuboidCollider args={[30, 2, 30]} />
      </RigidBody>
    </>
  )
}

const Enemy = ({ position, color }) => (
  <RigidBody colliders="cuboid" type="fixed" position={position} restitution={2.1}>
    <mesh>
      <boxGeometry args={[2.5, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  </RigidBody>
)

function Paddle({ euler = new THREE.Euler(), quaternion = new THREE.Quaternion() }) {
  const ref = useRef()
  useFrame(({ pointer, viewport }) => {
    ref.current.setTranslation({ x: (pointer.x * viewport.width) / 2, y: -viewport.height / 3, z: 0 })
    ref.current.setRotation(quaternion.setFromEuler(euler.set(0, 0, (pointer.x * Math.PI) / 10)))
  })
  return (
    <RigidBody ref={ref} colliders="cuboid" type="fixed" restitution={2.1}>
      <mesh>
        <boxGeometry args={[4, 1, 1]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>
    </RigidBody>
  )
}
