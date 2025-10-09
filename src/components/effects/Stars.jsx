"use client";
import React, { useRef, useMemo } from "react";
import { Points, PointMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function Stars({ count = 4000, color = "white", spread = 400 }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.cbrt(Math.random()) * spread;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count, spread]);

  const pointsRef = useRef();
  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += 0.00003;
    pointsRef.current.rotation.x += 0.00003;
    const t = clock.getElapsedTime();
    pointsRef.current.material.opacity = 0.7 + Math.sin(t * 0.2) * 0.05;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        vertexColors={false}
        color={color}
        size={0.15}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}
