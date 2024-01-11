import vertexShader from './vertexShader.glsl'
import fragmentShader from './fragmentShader.glsl'
import fragmentSimulation from './fragmentSimulation.glsl'
import * as THREE from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'

import { useFrame, useThree } from '@react-three/fiber'

import { useCallback, useMemo, useRef } from 'react'
import { render } from 'react-dom'

export default function ProtoTipo() {
     // * ----> Some important Variables
     const width = 32
     const { gl } = useThree()
     const pointsRef = useRef()

     const uniforms = useCallback(() => {
          // let a = 10
          // a = a + 1
          // console.log(a )
          return {
               time: { value: 0.0 },
               positionTexture: { type: 't', value: null },
               resolution: { value: new THREE.Vector4() }
          }
     }, [])

     // const abc = useCallback(() => {
     //      const a =  {
     //           ab: { value: 200 }
     //      }
     //      const b = 2000
     //      return {a, b}
     // }, [])

     // console.log(abc().a.ab)

     // $ ----> Prepare GP GPU

     // * ----.

     // $ ----> Main Material / Uniforms / Fill

     const GPGPUInit = useMemo(() => {
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

          positionVariable.material.uniforms['time'] = { value: 0.0 }

          positionVariable.wrapS = THREE.RepeatWrapping
          positionVariable.wrapT = THREE.RepeatWrapping

          // dtPosition.needsUpdate = true

          gpuCompute.init()

          return { gpuCompute, dtPosition, positionVariable }
     }, [])


     const particlesPosition = useCallback(() => {
          const array = new Float32Array(width * width * 3)
          const reference = new Float32Array(width * width * 2)

          for (let i = 0; i < width * width; i++) {
               let i3 = i * 3

               let x = Math.random()
               let y = Math.random()
               let z = Math.random()

               array[i * 3 + 0] = x
               array[i * 3 + 1] = y
               array[i * 3 + 2] = z

               // --> uv
               let xx = (i % width) / width
               let yy = ~~(i / width) / width

               reference[i * 2 + 0] = xx
               reference[i * 2 + 1] = yy
          }

          return { array, reference }
     }, [])

     // useEffect(() => {
     // })

     // * ----.

     useFrame((state) => {
          

          // pointsRef.current.material.uniforms.time.value = elapseTime
          // GPGPUInit().positionVariable.material.uniforms['time'].value = elapseTime
     })


     const render = () => {

          
          if(pointsRef.current){
               GPGPUInit.gpuCompute.compute()
               pointsRef.current.material.uniforms.positionTexture.value =
                    GPGPUInit.gpuCompute.getCurrentRenderTarget(GPGPUInit.positionVariable).texture
               
          }

          
          requestAnimationFrame(render)
        }

        render()

     return (
          <>
               <points ref={pointsRef}>
                    <bufferGeometry>
                         <bufferAttribute
                              attach={'attributes-position'}
                              itemSize={3}
                              array={particlesPosition().array}
                              count={width * width}
                         />
                         <bufferAttribute
                              attach={'attributes-reference'}
                              itemSize={2}
                              count={width * width * 2}
                              array={particlesPosition().reference}
                         />
                    </bufferGeometry>
                    <shaderMaterial
                         vertexShader={vertexShader}
                         fragmentShader={fragmentShader}
                         uniforms={uniforms()}
                    />
               </points>
          </>
     )
}
