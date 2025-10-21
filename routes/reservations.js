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

  // res.json() 자체가 UTF-8 적용됨
  res.json(testData);
});

// DB 전체 예약 조회
if (reservationController && typeof reservationController.getAllReservations === "function") {
  router.get("/", reservationController.getAllReservations);
}

// 예약 생성
if (reservationController && typeof reservationController.createReservation === "function") {
  router.post("/", reservationController.createReservation);
}

// 예약 신청 (경로 매개변수 반드시 콜론 뒤에 이름)
if (reservationController && typeof reservationController.applyReservation === "function") {
  router.post("/:reservationId/apply", reservationController.applyReservation);
}

// 댓글 추가
if (reservationController && typeof reservationController.addComment === "function") {
  router.post("/:reservationId/comments", reservationController.addComment);
}

module.exports = router;
