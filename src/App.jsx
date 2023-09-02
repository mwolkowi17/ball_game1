import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier"
import * as THREE from "three"

//next make colision events
export default function App() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <directionalLight />
      <pointLight position={[-10, -10, -10]} />
      <Suspense>
        <Physics gravity={[0, -30, 0]}>
          <Ball />
          <Paddle />
          <Enemy color="orange" position={[2.75, 1.5, 0]} />
          <Enemy color="hotpink" position={[-2.75, 3.5, 0]} />
        </Physics>
      </Suspense>
    </Canvas>
  )
}

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
