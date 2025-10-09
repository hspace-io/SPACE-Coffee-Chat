"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import SpacecraftScene from "../camera/SpacecraftScene";
import CalendarTexture from "../camera/CalendarTexture";

export default function Spacecraft() {
  const handleDateClick = (date) => {
    // 클릭 시 예약 페이지로 이동
    window.location.href = `/ReservationList?date=${date.toISOString()}`;
  };

  return (
    <div className="w-full h-screen flex">
      {/* 3D 우주선 장면 */}
      <div className="w-2/3 h-full">
        <Canvas camera={{ position: [0, 2, 5], fov: 50 }} style={{ width: "100%", height: "100%" }}>
          <SpacecraftScene />
        </Canvas>
      </div>

      {/* 오른쪽 달력 */}
      <div className="w-1/3 h-full p-4 bg-gray-900 text-white">
        <h2 className="text-lg font-bold mb-4">예약 달력</h2>
        <CalendarTexture onDateClick={handleDateClick} />
      </div>
    </div>
  );
}
