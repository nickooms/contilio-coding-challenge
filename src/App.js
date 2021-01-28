import React from 'react';
import { Canvas, extend, useThree } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { BuildingElements } from './components';

import './styles.css';

extend({ OrbitControls });

const Scene = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree();
  return (
    <>
      <BuildingElements />
      <orbitControls args={[camera, domElement]} />
    </>
  );
};

const App = () => (
  <Canvas>
    <Scene />
  </Canvas>
);

export default App;
