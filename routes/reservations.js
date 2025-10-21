const express = require("express");
const path = require("path");
const router = express.Router();

// controllers 불러오기
const reservationController = require(path.join(__dirname, "..", "controllers", "reservationController.js"));

// 테스트 라우트
router.get("/test", (req, res) => {
  res.json([{ _id: "test", startTime: new Date() }]);
});

// 반드시 함수 확인
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
