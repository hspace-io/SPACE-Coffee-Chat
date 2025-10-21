// routes/reservations.js
const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController.js");

// 테스트 라우트
router.get("/test", (req, res) => {
  const testData = [
    {
      _id: "1",
      name: "테스트 예약",
      memo: "한글 메모",
      startTime: new Date(),
      endTime: new Date(new Date().getTime() + 3600 * 1000),
      maxPeople: 5,
      currentPeople: 0,
      applicants: [],
      comments: []
    }
  ];

  res.json(testData);
});

// DB 전체 예약 조회
if (reservationController?.getAllReservations) {
  router.get("/", reservationController.getAllReservations);
}

// 예약 생성
if (reservationController?.createReservation) {
  router.post("/", reservationController.createReservation);
}

// 예약 신청
if (reservationController?.applyReservation) {
  router.post("/:reservationId/apply", reservationController.applyReservation);
}

// 댓글 추가
if (reservationController?.addComment) {
  router.post("/:reservationId/comments", reservationController.addComment);
}

module.exports = router;
