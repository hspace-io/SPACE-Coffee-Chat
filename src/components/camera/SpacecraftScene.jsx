"use client";
import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function SpacecraftScene({ onDateClick }) {
  const modelRef = useRef();
  const astronautRef = useRef();
  const { camera } = useThree();

  // GLB 모델 로드
  const gltf = useGLTF("/models/untitled.glb");

  useEffect(() => {
    if (!modelRef.current) return;

    // astronaut 찾기
    const astronaut = modelRef.current.getObjectByName("astronaut");
    if (astronaut) astronautRef.current = astronaut;

    // 모델 스케일 조정
    modelRef.current.scale.set(1, 1, 1);

    // 카메라 초기 위치
    if (astronautRef.current) {
      camera.position.set(0, 2, 5);
      camera.lookAt(astronautRef.current.position);
    }
  }, [camera]);

  // 부드러운 카메라 회전
  useFrame(() => {
    if (astronautRef.current) {
      camera.lookAt(astronautRef.current.position);
    }
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <Suspense fallback={null}>
        <primitive ref={modelRef} object={gltf.scene} />
      </Suspense>
      <OrbitControls target={astronautRef.current ? astronautRef.current.position : new THREE.Vector3(0, 1, 0)} />
    </>
  );
}
