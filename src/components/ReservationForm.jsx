import React, { useState } from "react";
import axios from "axios";

export default function ReservationForm({ currentUserEmail, onSuccess }) {
  const [reservation, setReservation] = useState({
    name: "",
    maxPeople: "",
    startTime: "",
    endTime: "",
    memo: "",
  });

  const handleChange = (e) => {
    setReservation({ ...reservation, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://192.168.10.140:400/api/reservations", {
        ...reservation,
        email: currentUserEmail,
      });
      alert("예약 등록 완료!");
      setReservation({ name: "", maxPeople: "", startTime: "", endTime: "", memo: "" });
      onSuccess(); // 훅에서 fetch
    } catch (err) {
      console.error(err);
      alert("예약 등록 실패");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-2">
      <input name="name" value={reservation.name} onChange={handleChange} placeholder="예약명" className="border p-2 w-full" />
      <input type="number" name="maxPeople" value={reservation.maxPeople} onChange={handleChange} placeholder="최대 인원" className="border p-2 w-full" />
      <input type="datetime-local" name="startTime" value={reservation.startTime} onChange={handleChange} className="border p-2 w-full" />
      <input type="datetime-local" name="endTime" value={reservation.endTime} onChange={handleChange} className="border p-2 w-full" />
      <textarea name="memo" value={reservation.memo} onChange={handleChange} placeholder="메모" className="border p-2 w-full" />
      <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded">예약 등록</button>
    </form>
  );
}
