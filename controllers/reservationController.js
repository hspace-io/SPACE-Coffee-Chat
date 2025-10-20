const path = require("path");
const express = require("express");
const router = express.Router();
const reservationController = require(path.join(__dirname, "..", "controllers", "reservationController.js"));

// 🔹 테스트용 한글 데이터 라우트
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

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.json(testData);
});

// 기존 라우트
router.get("/", reservationController.getAllReservations);
router.post("/", reservationController.createReservation);
router.post("/:reservationId/apply", reservationController.applyReservation);
router.post("/:reservationId/comments", reservationController.addComment);

module.exports = router;
