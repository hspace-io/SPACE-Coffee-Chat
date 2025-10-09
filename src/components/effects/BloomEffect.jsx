"use client";
import React from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

export default function BloomEffect() {
  return (
    <EffectComposer>
      <Bloom intensity={1.5} luminanceThreshold={0.2} luminanceSmoothing={0.3} />
    </EffectComposer>
  );
}
