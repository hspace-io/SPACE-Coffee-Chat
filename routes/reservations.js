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
      endTime: new Date(new Date().getTime() + 3600 * 1000), // 1시간 후
      maxPeople: 5,
      currentPeople: 0,
      applicants: [],
      comments: []
    }
  ];

  // UTF-8 명시
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.json(testData);
});

// 실제 DB 조회 라우트
if (reservationController && typeof reservationController.getAllReservations === "function") {
  router.get("/", reservationController.getAllReservations);
}

// DB 예약 생성
if (reservationController && typeof reservationController.createReservation === "function") {
  router.post("/", reservationController.createReservation);
}

// 예약 신청
if (reservationController && typeof reservationController.applyReservation === "function") {
  router.post("/:reservationId/apply", reservationController.applyReservation);
}

// 댓글 추가
if (reservationController && typeof reservationController.addComment === "function") {
  router.post("/:reservationId/comments", reservationController.addComment);
}

module.exports = router;
