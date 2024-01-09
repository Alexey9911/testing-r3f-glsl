import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'

import vertexShader from './vertexShader.glsl'
import fragmentShader from './fragmentShader.glsl'
import fragmentSimulation from './fragmentSimulation.glsl'
import * as THREE from 'three'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'

export default function FBOon() {
     // * ----> Some important Variables
     const width = 32
     const { gl } = useThree()
     const pointsRef = useRef()

     // $ ----> Prepare GP GPU
     const gpuCompute = useMemo(() => {
          const gpuCompute = new GPUComputationRenderer(width, width, gl)
          const dtPosition = gpuCompute.createTexture()

          

          for (let i = 0; i < width * width; i++) {
               const i4 = i * 4
               let x = Math.random()
               let y = Math.random()
               let z = Math.random()

               dtPosition.image[i4 + 0] = Math.random()
               dtPosition.image[i4 + 1] = Math.random()
               dtPosition.image[i4 + 2] = Math.random()
               dtPosition.image[i4 + 3] = 1
          }

          const positionVariable = gpuCompute.addVariable(
               'texturePosition',
               fragmentSimulation,
               dtPosition
          )

          positionVariable.material.uniforms['time'] = { value: 0 }

          positionVariable.wrapS = THREE.RepeatWrapping
          positionVariable.wrapT = THREE.RepeatWrapping

          // dtPosition.needsUpdate = true

          gpuCompute.init()

          return gpuCompute
     }, [])

     useEffect(() => {
          // gpuCompute.variables[0].initialValueTexture.image.dat
     }, [])

     // * ----.

     // $ ----> Main Material / Uniforms / Fill

     const uniforms = useMemo(
          () => ({
               time: { value: 0 },
               positionTexture: { value: null },
               resolution: { value: new THREE.Vector4() }
          }),
          []
     )

     const particlesPosition = useMemo(() => {
          const array = new Float32Array(width * width * 3)
          const reference = new Float32Array(width * width * 2)

          for (let i = 0; i < width * width; i++) {
               let i3 = i * 3

               let x = Math.random()
               let y = Math.random()
               let z = Math.random()

               // --> uv
               let xx = (i % width) / width
               let yy = ~~(i / width) / width

               array.set([x, y, z], i * 3)
               reference.set([xx, yy], i * 2)
          }
          return {
               positions: array,
               reference: reference
          }
     }, [])

     // useEffect(() => {
     // })

     // * ----.

     useFrame((state) => {
          gpuCompute.compute()
          let elapseTime = state.clock.getElapsedTime()

          pointsRef.current.material.uniforms.positionTexture.value =
               gpuCompute.getCurrentRenderTarget(gpuCompute.variables[0]).texture

          pointsRef.current.geometry.attributes.position.needsUpdate = true

          // pointsRef.current.material.uniforms.time.value = elapseTime
     })
     useEffect(() => {
          console.log(gpuCompute)
     }, [])

     return (
          <>
               <points ref={pointsRef}>
                    <bufferGeometry>
                         <bufferAttribute
                              attach={'attributes-position'}
                              itemSize={3}
                              array={particlesPosition.positions}
                              count={width * width}
                         />
                         <bufferAttribute
                              attach={'attributes-reference'}
                              itemSize={2}
                              count={width * width * 2}
                              array={particlesPosition.reference}
                         />
                    </bufferGeometry>
                    <shaderMaterial
                         vertexShader={vertexShader}
                         fragmentShader={fragmentShader}
                         uniforms={uniforms}
                    />
               </points>
          </>
     )
}
