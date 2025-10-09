import React, { useState } from "react";
import ReservationForm from "../components/ReservationForm";
import ReservationCalendar from "../components/CalendarSchedule";
import ApplyModal from "../components/ApplyModal";
import CommentModal from "../components/CommentModal";
import { useReservations } from "../hooks/useReservations";

export default function ReservationManager({ currentUser }) {
  const { allReservations, futureReservations, fetchReservations } = useReservations();
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comments, setComments] = useState([]);

  return (
    <div className="p-4">
      <ReservationForm currentUserEmail={currentUser.email} onSuccess={fetchReservations} />

      <div className="grid md:grid-cols-2 gap-4">
        {/* 예약 목록 */}
        <div>
          <h2 className="font-semibold mb-2">예약 목록</h2>
          {futureReservations.length === 0 && <p>등록된 예약이 없습니다.</p>}
          {futureReservations.map(r => {
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
                      onClick={() => { setSelectedReservation(r); setShowApplyModal(true); }}
                      disabled={isPast || isFull}
                      className={`mt-2 px-2 py-1 rounded text-white ${!isPast && !isFull ? "bg-blue-500" : "bg-gray-300 text-gray-700 cursor-not-allowed"}`}
                    >
                      {isFull ? "정원 마감" : isPast ? "신청 마감" : "예약 신청"}
                    </button>
                    <button
                      onClick={() => { setSelectedReservation(r); setComments(r.comments || []); setShowCommentModal(true); }}
                      className="mt-1 px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs"
                    >
                      댓글 보기
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 캘린더 */}
        <div>
          <h2 className="font-semibold mb-2">주간 캘린더</h2>
          <ReservationCalendar
            key={allReservations.length}
            reservations={allReservations}
            onApply={(reservation) => { setSelectedReservation(reservation); setShowApplyModal(true); }}
            startHour={7}
            endHour={22}
          />
        </div>
      </div>

      {/* 모달 */}
      {showApplyModal && selectedReservation && (
        <ApplyModal
          reservation={selectedReservation}
          currentUser={currentUser}
          onApply={async (res, applicant) => {
            await fetchReservations();
            setShowApplyModal(false);
            setSelectedReservation(null);
          }}
          onClose={() => setShowApplyModal(false)}
        />
      )}
      {showCommentModal && selectedReservation && (
        <CommentModal
          reservation={selectedReservation}
          comments={comments}
          onAddComment={() => {}}
          onClose={() => setShowCommentModal(false)}
        />
      )}
    </div>
  );
}
