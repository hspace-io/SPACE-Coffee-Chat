"use client";
import React, { useRef, useState, useEffect, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { RGBELoader } from "three-stdlib";

import FullModel from "../models/FullModel";
import Stars from "../effects/Stars";
import BloomEffect from "../effects/BloomEffect";
import EnvironmentMap from "../effects/EnvironmentMap";

export default function SpaceScene({
  modelPath,
  astronautMeshName = "astronaut",
  spaceshipMeshName = "spacecraft",
  speedRef,
  camHeightRef,
  camDistRef,
}) {
  const modelRef = useRef();
  const { camera, gl } = useThree();

  const [astronautRef, setAstronautRef] = useState(null);
  const [spaceshipRef, setSpaceshipRef] = useState(null);
  const [moving, setMoving] = useState(false);

  const initialAstronautPos = useRef(new THREE.Vector3());
  const randomOffset = useRef({ x: 0.15, y: 0.15, z: 0.15, rx: 0.002, ry: 0.002, rz: 0.002 });
  const astronautEnvMap = useRef();

  // HDRI 로드
  useEffect(() => {
    new RGBELoader().load("/hdri/space.exr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      astronautEnvMap.current = texture;
    });
  }, []);

  // 카메라 레이어: 우주복(0) + 우주선(1)
  useEffect(() => {
    camera.layers.enable(0);
    camera.layers.enable(1);
  }, [camera]);

  // 모델 refs 설정
  useEffect(() => {
    const interval = setInterval(() => {
      if (!modelRef.current) return;
      const nodes = modelRef.current;

      // 우주복
      if (!astronautRef && nodes[astronautMeshName]) {
        setAstronautRef({ current: nodes[astronautMeshName] });
        initialAstronautPos.current.copy(nodes[astronautMeshName].getWorldPosition(new THREE.Vector3()));

        nodes[astronautMeshName].traverse((child) => {
          if (child.isMesh && child.material && astronautEnvMap.current) {
            child.layers.set(0);
            child.material = child.material.clone();
            child.material.envMap = astronautEnvMap.current;
            child.material.envMapIntensity = 1;
            child.material.metalness = 1;
            child.material.roughness = 0.2;
            child.material.needsUpdate = true;
          }
        });
      }

      // 우주선
      if (!spaceshipRef && nodes[spaceshipMeshName]) {
        setSpaceshipRef({ current: nodes[spaceshipMeshName] });
        nodes[spaceshipMeshName].traverse((child) => {
          if (child.isMesh) child.layers.set(1);
        });
      }

      if (nodes[astronautMeshName] && nodes[spaceshipMeshName]) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, [astronautRef, spaceshipRef, astronautMeshName, spaceshipMeshName]);

  // 클릭 감지
  useEffect(() => {
    if (!astronautRef?.current || !spaceshipRef?.current) return;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(astronautRef.current, true);
      if (intersects.length > 0) {
        setMoving(true);

        // 제트팩 불 켜기 (Blender Emission 색상 그대로)
        ["ThrustFlame", "ThrustFlame2"].forEach((name) => {
          const flame = modelRef.current[name];
          if (flame) {
            flame.visible = true;
            flame.traverse((child) => {
              if (child.isMesh && child.material && child.material.emissive) {
                child.material = child.material.clone();
                child.material.emissive.copy(child.material.emissive);
                child.material.emissiveIntensity = 5;
                child.material.needsUpdate = true;
              }
            });
          }
        });
      }
    };

    gl.domElement.addEventListener("pointerdown", onPointerDown);
    return () => gl.domElement.removeEventListener("pointerdown", onPointerDown);
  }, [astronautRef, spaceshipRef, camera, gl]);

  // 애니메이션
  useFrame(() => {
    if (!astronautRef?.current) return;
    const t = performance.now() * 0.001 * (speedRef?.current || 1);
    const { x, y, z, rx, ry, rz } = randomOffset.current;

    // 클릭 전: 우주복 앞쪽을 보는 카메라
    if (!moving) {
      astronautRef.current.position.x = initialAstronautPos.current.x + Math.sin(t * 0.5) * x;
      astronautRef.current.position.y = initialAstronautPos.current.y + Math.sin(t * 0.7) * y + 1;
      astronautRef.current.position.z = initialAstronautPos.current.z + Math.sin(t * 0.3) * z;

      astronautRef.current.rotation.x += rx;
      astronautRef.current.rotation.y += ry;
      astronautRef.current.rotation.z += rz;

      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(astronautRef.current.quaternion); // 얼굴 앞쪽
      const camHeight = camHeightRef?.current || 2;
      const camDist = camDistRef?.current || 5;

      camera.position.copy(
        astronautRef.current.position.clone().add(forward.clone().multiplyScalar(-camDist).add(new THREE.Vector3(0, camHeight, 0)))
      );
      camera.lookAt(astronautRef.current.position.clone().add(forward));
    }

    // 클릭 후: 우주선 쪽으로 이동
    else if (spaceshipRef?.current) {
      const direction = new THREE.Vector3().subVectors(spaceshipRef.current.position, astronautRef.current.position);
      const distance = direction.length();

      if (distance > 0.05) {
        direction.normalize();
        astronautRef.current.position.add(direction.multiplyScalar(0.1));
        astronautRef.current.lookAt(spaceshipRef.current.position);

        // 클릭 시 카메라: 우주선 방향으로 이동 느낌
        const camHeightMoving = 6; // 높이는 약간 낮춰서 우주선도 보이도록
        const camDistMoving = 7; // 약간 가까이
        const camTarget = astronautRef.current.position
          .clone()
          .sub(direction.clone().multiplyScalar(camDistMoving))
          .add(new THREE.Vector3(0, camHeightMoving, 0));

        // lerp로 부드럽게 따라가기
        camera.position.lerp(camTarget, 0.05);
        camera.lookAt(astronautRef.current.position.clone().lerp(spaceshipRef.current.position, 0.3)); // 살짝 우주선 쪽으로 시선 이동
      } else {
        setMoving(false);
        ["ThrustFlame", "ThrustFlame2"].forEach((name) => {
          const flame = modelRef.current[name];
          if (flame) flame.visible = false;
        });
        window.location.href = "/ReservationList";
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} />

      <Stars count={4000} color="#C2D9FF" spread={50} />
      <Stars count={4000} color="#8E8FFA" spread={50} />

      <Suspense fallback={null}>
        <EnvironmentMap hdriPath="/hdri/space.exr" backgroundOnly />
        <FullModel ref={modelRef} modelPath={modelPath} />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        rotateSpeed={0.5}
        target={astronautRef ? astronautRef.current.position : new THREE.Vector3(0, 0, 0)}
      />

      {astronautRef && <BloomEffect layers={0} />}
    </>
  );
}
