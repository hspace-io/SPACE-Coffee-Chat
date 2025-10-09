import React, { useRef, useEffect, useState } from "react";

export default function CalendarTexture({ onDateClick }) {
  const [today, setToday] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setToday(new Date()), 60000); // 1분마다 갱신
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="calendar absolute right-4 top-4 w-64 bg-white p-2 rounded shadow">
      <h2 className="font-bold mb-2 text-center">{today.toLocaleDateString()}</h2>
      <button
        onClick={onDateClick}
        className="w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
      >
        예약 확인
      </button>
    </div>
  );
}
