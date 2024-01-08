import vertexShader from './vertexShader.glsl'
import fragmentShader from './fragmentShader.glsl'
import fragmentSimulation from './fragmentSimulation.glsl'
import * as THREE from 'three'

import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'

export default function FBOon() {
     // * ----> Some important Variables
     const width = 32
     const { gl } = useThree()
     const pointsRef = useRef()

     // $ ----> Main Material / Uniforms / Fill

     const uniforms = useMemo(
          () => ({
               time: { value: 0 },
               positionTexture: { value: null },
               // resolution: { value: new THREE.Vector4() }
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

               array.set([x, y, z], i3)
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

     // $ ----> Prepare GP GPU
     const gpuCompute = useMemo(() => {
          const gpuCompute = new GPUComputationRenderer(width, width, gl)
          const dtPosition = gpuCompute.createTexture()
          const positionVariable = gpuCompute.addVariable(
               'texturePosition',
               fragmentSimulation,
               dtPosition
          )
          positionVariable.material.uniforms['time'] = { value: 0 }

          positionVariable.wrapS = THREE.RepeatWrapping
          positionVariable.wrapT = THREE.RepeatWrapping

          // dtPosition.needsUpdate = true

          const error = gpuCompute.init()

          if (error !== null) {
               console.error(error)
          }

          for (let i = 0; i < width * width; i++) {
               let i3 = i * 3

               dtPosition.image.data[i3 + 0] = Math.random()
               dtPosition.image.data[i3 + 1] = Math.random() 
               dtPosition.image.data[i3 + 2] = Math.random() 
               dtPosition.image.data[i3 + 3] = 100
          }

          dtPosition.needsUpdate = true
          console.log("dtPosition.image.data.length:", dtPosition.image.data)

          return {
               gpuCompute: gpuCompute,
               positionVariable: positionVariable,
               dtPosition: dtPosition
          }
     }, [])

     // * ----.

     useFrame((state) => {
          gpuCompute.gpuCompute.compute()

          pointsRef.current.material.uniforms.positionTexture.value =
               gpuCompute.gpuCompute.getCurrentRenderTarget(gpuCompute.positionVariable).texture

          gpuCompute.positionVariable.material.uniforms.time.value = state.clock.getElapsedTime()
     })
     

     useEffect(() => {
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
                              count={width * width}
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
