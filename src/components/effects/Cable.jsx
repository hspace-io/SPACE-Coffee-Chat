"use client";
import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function Cable({ astronautRef, spaceshipRef, segments = 20 }) {
  const { nodes } = useGLTF("/models/untitled.glb");
  const cableRef = useRef();

  // 초기 geometry/material
  const geom = useRef(new THREE.BufferGeometry());
  const mat = useRef(nodes?.line?.material || new THREE.MeshBasicMaterial({ color: 0xffffff }));

  // 초기 geometry 세팅
  if (geom.current.attributes.position === undefined) {
    const positions = new Float32Array(segments * 3);
    geom.current.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  }

  useFrame(() => {
    if (!astronautRef?.current || !spaceshipRef?.current || !cableRef.current) return;

    const start = new THREE.Vector3();
    const end = new THREE.Vector3();

    // 월드 좌표 기준으로 가져오기
    spaceshipRef.current.getWorldPosition(start);
    astronautRef.current.getWorldPosition(end);

    const posAttr = cableRef.current.geometry.attributes.position;
    for (let i = 0; i < segments; i++) {
      const t = i / (segments - 1);

      // 우주복과 우주선 사이 선형 보간
      const point = start.clone().lerp(end, t);

      // 자연스러운 출렁임 추가
      const wave = Math.sin(performance.now() * 0.002 + t * Math.PI) * 0.02;
      point.y += wave;

      posAttr.setXYZ(i, point.x, point.y, point.z);
    }
    posAttr.needsUpdate = true;
  });

  return <mesh ref={cableRef} geometry={geom.current} material={mat.current} />;
}

useGLTF.preload("/models/untitled.glb");
