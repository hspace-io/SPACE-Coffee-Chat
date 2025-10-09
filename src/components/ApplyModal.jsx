import React from "react";

export default function ApplyModal({ reservation, applicant, setApplicant, onApply, onClose, }) {
  if (!reservation) return null;

  const handleChange = (field, value) => {
    setApplicant({ ...applicant, [field]: value });
  };

  return (
    
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-2">{reservation.name} - 예약 신청</h2>

        <input
          type="email"
          placeholder="이메일"
          value={applicant.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <input
          type="text"
          placeholder="닉네임"
          value={applicant.nickname || ""}
          onChange={(e) => handleChange("nickname", e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <button
          onClick={() => onApply(reservation, applicant)}
          className="w-full bg-blue-500 text-white px-3 py-1 rounded mb-2"
        >
          신청
        </button>

        <button
          onClick={onClose}
          className="w-full bg-gray-400 text-white px-3 py-1 rounded"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
