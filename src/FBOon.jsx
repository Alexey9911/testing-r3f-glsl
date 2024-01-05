import vertexShader from './vertexShader.glsl'
import fragmentShader from './fragmentShader.glsl'
import fragmentSimulation from './fragmentSimulation.glsl'
import * as THREE from 'three'

import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import { useThree } from '@react-three/fiber'
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
               resolution: { value: new THREE.Vector4() }
          }),
          []
     )

     const particlesPosition = useMemo(() => {
          const array = new Float32Array(width * width * 3)
          const reference = new Float32Array(width * width * 2)

          for (let i = 0; i < width * width; i++) {
               let i3 = i * 3

               let x = Math.random() - 0.5
               let y = Math.random() - 0.5
               let z = Math.random() - 0.5

               // uv
               let xx = (i % width) / width
               let yy = ~~(i / width) / width
               
               array.set([x,y,z], i3)
               reference.set([xx,yy],i*2)
          }
          console.log("reference:", reference)

          return array
     }, [])

     useEffect(() => {
          // console.log(pointsRef.current.geometry.attributes.position.array[0] = Math.random())
     })

     // * ----.

     // $ ----> Prepare GP GPU
     const gpuCompute = useMemo(() => {
          const gpuCompute = new GPUComputationRenderer(width, width, gl.render)
          const dtPosition = gpuCompute.createTexture()
          const positionVariable = gpuCompute.addVariable(
               'positionTexture',
               fragmentSimulation,
               dtPosition
          )

          positionVariable.material.uniforms['time'] = { value: 0 }

          positionVariable.wrapS = THREE.RepeatWrapping
          positionVariable.wrapT = THREE.RepeatWrapping

          // gpuCompute.init()

          for (let i = 0; i < width * width * 4; i++) {
               let i3 = i * 3

               gpuCompute.variables[0].initialValueTexture.source.data.data[i3 + 0] = Math.random()
               gpuCompute.variables[0].initialValueTexture.source.data.data[i3 + 1] = Math.random()
               gpuCompute.variables[0].initialValueTexture.source.data.data[i3 + 2] = Math.random()
               gpuCompute.variables[0].initialValueTexture.source.data.data[i3 + 3] = 1
          }

          return gpuCompute
     }, [])

     // useEffect(() => {}, [])

     // * ----.

     return (
          <>
               <points ref={pointsRef}>
                    <bufferGeometry>
                         <bufferAttribute
                              attach={'attributes-position'}
                              itemSize={3}
                              array={particlesPosition}
                              count={width * width}
                         />
                    </bufferGeometry>
                    <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} />
               </points>
          </>
     )
}
