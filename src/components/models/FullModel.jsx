"use client";
import React, { useEffect, forwardRef } from "react";
import { useGLTF } from "@react-three/drei";

const FullModel = forwardRef(({ modelPath }, ref) => {
  const { scene, nodes } = useGLTF(modelPath);

  useEffect(() => {
    if (ref) {
      ref.current = nodes; // nodes 전체를 ref로 전달
    }
  }, [nodes, ref]);

  return <primitive object={scene} />;
});

export default FullModel;

// 정적 경로라면 그대로 preload 가능
useGLTF.preload("/models/untitled.glb");
