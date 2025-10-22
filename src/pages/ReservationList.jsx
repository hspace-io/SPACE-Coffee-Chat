import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import CalendarSchedule from "../components/CalendarSchedule";
import ApplyModal from "../components/ApplyModal";

export default function ReservationList({ currentUser }) {
  const location = useLocation();
  const [allReservations, setAllReservations] = useState([]);
  const [futureReservations, setFutureReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicant, setApplicant] = useState({ email: "", nickname: "" });

  const fetchReservations = async () => {
    try {
      const res = await axios.get("/api/reservations"); // ✅ 상대경로
      const now = new Date();
      const all = res.data.map((r) => ({ ...r, id: r._id, currentPeople: r.currentPeople || 0 }));
      setAllReservations(all);
      setFutureReservations(all.filter((r) => new Date(r.startTime) > now));
    } catch (err) {
      console.error(err);
      alert("예약 데이터를 가져오는데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleApply = async (reservation, applicantData) => {
    if (!reservation || !applicantData.email || !applicantData.nickname) {
      return alert("이메일과 닉네임을 입력해주세요.");
    }
    try {
      const res = await axios.post(`/api/reservations/${reservation.id}/apply`, applicantData); // ✅ 상대경로
      if (res.data.message === "예약 신청 완료") {
        await fetchReservations();
        alert("예약 신청 완료!");
        setSelectedReservation(null);
        setApplicant({ email: "", nickname: "" });
        setShowApplyModal(false);
      } else {
        alert(res.data.message || "예약 신청 실패");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "예약 신청 실패");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">예약 확인 & 신청</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h2 className="font-semibold mb-2">예약 목록</h2>
          {futureReservations.length === 0 && <p>등록된 예약이 없습니다.</p>}
          {futureReservations.map((r) => {
            const isPast = new Date(r.startTime) <= new Date();
            const isFull = r.currentPeople >= r.maxPeople;
            return (
              <div key={r.id} className="border p-2 mb-2 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-xs text-gray-600">{new Date(r.startTime).toLocaleString()} - {new Date(r.endTime).toLocaleTimeString()}</div>
                    <div className="text-xs text-gray-600">메모: {r.memo}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{r.currentPeople}/{r.maxPeople}</div>
                    <button
                      onClick={() => { setSelectedReservation(r); setApplicant({ email: currentUser?.email || "", nickname: currentUser?.nickname || "" }); setShowApplyModal(true); }}
                      disabled={isPast || isFull}
                      className={`mt-2 px-2 py-1 rounded text-white ${!isPast && !isFull ? "bg-blue-500" : "bg-gray-300 text-gray-700 cursor-not-allowed"}`}
                    >
                      {isFull ? "정원 마감" : isPast ? "신청 마감" : "예약 신청"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <h2 className="font-semibold mb-2">주간 캘린더 (30분)</h2>
          <CalendarSchedule
            key={allReservations.length}
            reservations={allReservations}
            onApply={(reservation) => {
              if (reservation) { setSelectedReservation(reservation); setApplicant({ email: currentUser?.email || "", nickname: currentUser?.nickname || "" }); setShowApplyModal(true); }
            }}
            startHour={7}
            endHour={22}
          />
        </div>
      </div>

      {selectedReservation && showApplyModal && (
        <ApplyModal
          reservation={selectedReservation}
          applicant={applicant}
          setApplicant={setApplicant}
          onApply={handleApply}
          onClose={() => setShowApplyModal(false)}
        />
      )}
    </div>
  );
}
