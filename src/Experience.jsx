import { OrbitControls } from '@react-three/drei'
import FBOon from './fboOn'

export default function Experience() {
     return (
          <>
               <color attach={'background'} args={['#002']}>
               </color>
               <OrbitControls enableDamping />
               <directionalLight position={[1, 2, 3]} intensity={4.5} />
               <ambientLight intensity={1.5} />



               <FBOon/>
          </>
     )
}
