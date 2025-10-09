"use client";
import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import SpaceScene from "../components/camera/SpaceScene";

export default function Home() {
  // UI 상태
  const [speed, setSpeed] = useState(0.8);
  const [camHeight, setCamHeight] = useState(5);
  const [camDist, setCamDist] = useState(11.4);

  // Ref로 바로 전달
  const speedRef = useRef(speed);
  const camHeightRef = useRef(camHeight);
  const camDistRef = useRef(camDist);

  // 슬라이더 핸들러
  const handleSpeed = (v) => { speedRef.current = v; setSpeed(v); };
  const handleHeight = (v) => { camHeightRef.current = v; setCamHeight(v); };
  const handleDist = (v) => { camDistRef.current = v; setCamDist(v); };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black">
      {/* UI 컨트롤 */}
      <div className="absolute top-5 left-5 z-10 text-white space-y-4">
        <div>
          <label className="flex flex-col">
            <span>속도: {speed.toFixed(2)}</span>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.05"
              value={speed}
              onChange={(e) => handleSpeed(parseFloat(e.target.value))}
              className="w-48"
            />
          </label>
        </div>
        <div>
          <label className="flex flex-col">
            <span>카메라 높이: {camHeight.toFixed(1)}</span>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={camHeight}
              onChange={(e) => handleHeight(parseFloat(e.target.value))}
              className="w-48"
            />
          </label>
        </div>
        <div>
          <label className="flex flex-col">
            <span>카메라 거리: {camDist.toFixed(1)}</span>
            <input
              type="range"
              min="3"
              max="20"
              step="0.1"
              value={camDist}
              onChange={(e) => handleDist(parseFloat(e.target.value))}
              className="w-48"
            />
          </label>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [8.9, camHeight, -camDist], fov: 55 }}>
        <SpaceScene
          modelPath="/models/untitled.glb"
          astronautMeshName="astronaut"
          spaceshipMeshName="spacecraft"
          speedRef={speedRef}
          camHeightRef={camHeightRef}
          camDistRef={camDistRef}
        />
      </Canvas>
    </div>
  );
}
