"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import SpaceScene from "./SpaceScene";

export default function SpaceBackground({
  modelPath,
  astronautMeshName,
  camHeight = 10,
  camDist = 40,
  speed = 2,
}) {
  return (
    <Canvas camera={{ position: [0, camHeight, -camDist], fov: 45 }}>
      <SpaceScene
        modelPath={modelPath}
        astronautMeshName={astronautMeshName}
        camHeight={camHeight}
        camDist={camDist}
        speed={speed}
      />
    </Canvas>
  );
}
