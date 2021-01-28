import React, { Suspense, useRef, useState, useEffect } from 'react';
import { useLoader } from 'react-three-fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { Mesh, MeshBasicMaterial } from 'three';

import {
  COLOR_MATTERHORN,
  COLOR_RED,
  COLOR_YELLOW,
  CSV_FILE_NAME,
  CSV_NEW_LINE,
  CSV_DELIMITER,
  STATE_OK,
  STATE_MISSING,
  STATE_OUT_OF_TOLERANCE,
} from './constants.js';

const BuildingElement = ({ url, color }) => {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);
  const geometry = useLoader(STLLoader, url);
  const material = new MeshBasicMaterial({
    color,
    transparent: true,
    opacity: hovered ? 0.25 : 0.9,
  });
  const mesh = new Mesh(geometry, material);
  mesh.scale.multiplyScalar(0.2);
  mesh.rotation.x = -Math.PI / 2;
  return (
    <primitive
      object={mesh}
      ref={meshRef}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    />
  );
};

const getColor = (state) => {
  switch (state) {
    case STATE_OK:
      return COLOR_MATTERHORN;
    case STATE_MISSING:
      return COLOR_RED;
    case STATE_OUT_OF_TOLERANCE:
      return COLOR_YELLOW;
    default:
      throw new Error(`Unknown state '${state}'`);
  }
};

const parseRow = (columns) => (row) =>
  row
    .split(CSV_DELIMITER)
    .reduce((element, value, index) => ({ ...element, [columns[index]]: value }), {});

const getURL = (guid) => `../../assets/mesh/${guid}.stl`;

const toCamelCase = (text) => text[0].toLowerCase() + text.substr(1);

const BuildingElements = () => {
  const [buildingElements, setBuildingElements] = useState([]);

  useEffect(() => {
    const getCSV = async () => {
      const response = await fetch(`../../assets/${CSV_FILE_NAME}`);
      const csvText = await response.text();
      const [columnNames, ...lines] = csvText.split(CSV_NEW_LINE);
      const columns = columnNames.split(CSV_DELIMITER).map(toCamelCase);
      setBuildingElements(lines.filter(Boolean).map(parseRow(columns)));
    };
    getCSV();
  }, []);

  return (
    <Suspense fallback={null}>
      {buildingElements.map(({ guid, state }) => (
        <BuildingElement key={guid} url={getURL(guid)} color={getColor(state)} />
      ))}
    </Suspense>
  );
};

export default BuildingElements;
