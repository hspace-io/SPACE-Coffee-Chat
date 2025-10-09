"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function CameraFollow({ targetRef, camHeight = 2, camDist = 5 }) {
  const { camera } = useThree();
  const offset = useRef(new THREE.Vector3(0, camHeight, -camDist));

  useFrame(() => {
    if (!targetRef?.current) return;

    const targetPos = targetRef.current.getWorldPosition(new THREE.Vector3());

    // 카메라 위치 보간
    camera.position.lerp(targetPos.clone().add(offset.current), 0.05);

    // 카메라가 항상 우주복 정면을 바라보도록
    const lookAtPos = targetPos.clone();
    camera.lookAt(lookAtPos);
  });

  return null;
}
