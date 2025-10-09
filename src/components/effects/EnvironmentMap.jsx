"use client";
import React, { useEffect, useMemo } from "react";
import { useThree, useLoader } from "@react-three/fiber";
import { EXRLoader } from "three-stdlib";
import * as THREE from "three";

export default function EnvironmentMap({ hdriPath }) {
  const { gl, scene } = useThree();
  const texture = useLoader(EXRLoader, hdriPath);

  const envMap = useMemo(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    const env = pmremGenerator.fromEquirectangular(texture).texture;
    texture.dispose();
    pmremGenerator.dispose();
    return env;
  }, [texture, gl]);

  useEffect(() => {
    if (envMap) scene.environment = envMap;
    scene.environmentIntensity = 0.3;
  }, [envMap, scene]);

  return null;
}


