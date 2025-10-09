import React, { useState } from "react";

export default function CommentModal({ reservation, comments, onAddComment, onClose }) {
  const [newComment, setNewComment] = useState("");

  const handleAdd = () => {
    if (newComment.trim()) {
      onAddComment(reservation, newComment);
      setNewComment("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-2">{reservation.name} - 댓글</h2>
        {comments.map((c, i) => (
          <div key={i} className="border-b py-1 text-sm">{c.text} <span className="text-xs text-gray-500">({new Date(c.createdAt).toLocaleString()})</span></div>
        ))}
        <div className="mt-2 flex gap-2">
          <input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="댓글 입력" className="border p-2 flex-1" />
          <button onClick={handleAdd} className="bg-green-500 text-white px-3 py-1 rounded">등록</button>
        </div>
        <button onClick={onClose} className="mt-2 w-full bg-gray-400 text-white px-3 py-1 rounded">닫기</button>
      </div>
    </div>
  );
}
