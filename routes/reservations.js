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
      endTime: new Date(Date.now() + 3600 * 1000), // 1시간 후
      maxPeople: 5,
      currentPeople: 0,
      applicants: [],
      comments: []
    }
  ];

  res.json(testData);
});

// DB 전체 예약 조회
router.get("/", reservationController.getAllReservations);

// 예약 생성
router.post("/", reservationController.createReservation);

// 예약 신청
router.post("/:reservationId/apply", reservationController.applyReservation);

// 댓글 추가
router.post("/:reservationId/comments", reservationController.addComment);

module.exports = router;
