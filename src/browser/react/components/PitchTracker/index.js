import React from 'react';

export const colorChange = pitch => 
  pitch 
  ? `#FFFF00`
  : `#00FF00`

export const PitchCircle = ({ pitch, position, rotation, geometry }) => (
  <a-entity 
    material={`color: ${colorChange(pitch)}`}
    position={position}
    rotation={rotation}
    geometry={geometry}
  >
  </a-entity>
);

PitchCircle.defaultProps = {
  position: "5.00 6 -10.00",
  rotation: "0 7.42 0",
  geometry: "primitive: circle; radius: 0.5",
};

export const PitchLabel = ({ position, scale, text }) => (
  <a-entity position={position}
            scale={scale}
            text={text}>
  </a-entity>
);

PitchLabel.defaultProps = {
  position: "8.80 6 -8.77",
  scale: "10 10 10", 
  text: "value: P\nI\nT\nC\nH; line-height: 30px;",
};

export default (props) => (
      <a-entity>
        <PitchCircle pitch={props.pitch}/>
        <PitchLabel/>
      </a-entity>
);

