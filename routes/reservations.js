const path = require("path");
const express = require("express");
const router = express.Router();

// controllers 불러오기
const reservationController = require(path.join(__dirname, "..", "controllers", "reservationController.js"));

// 🔹 테스트용 라우트
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

// 기존 controller 함수 등록
if (reservationController && typeof reservationController.getAllReservations === "function") {
  router.get("/", reservationController.getAllReservations);
}

if (reservationController && typeof reservationController.createReservation === "function") {
  router.post("/", reservationController.createReservation);
}

if (reservationController && typeof reservationController.applyReservation === "function") {
  router.post("/:reservationId/apply", reservationController.applyReservation);
}

if (reservationController && typeof reservationController.addComment === "function") {
  router.post("/:reservationId/comments", reservationController.addComment);
}

module.exports = router;
