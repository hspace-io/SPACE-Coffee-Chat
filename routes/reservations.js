const path = require("path");
const express = require("express");
const router = express.Router();
const reservationController = require(path.join(__dirname, "..", "controllers", "reservationController.js"));

// 🔹 임시 테스트용 라우트
router.get("/test", (req, res) => {
  res.json([{ _id: "test", startTime: new Date() }]);
});

// 정상 예약 라우트
router.get("/", reservationController.getAllReservations);
router.post("/", reservationController.createReservation);
router.post("/:reservationId/apply", reservationController.applyReservation);
router.post("/:reservationId/comments", reservationController.addComment);

module.exports = router;
