const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController.js");

// 테스트 라우트
router.get("/test", (req, res) => {
  res.json([{ _id: "test", startTime: new Date() }]);
});

// 기존 라우트
router.get("/", reservationController.getAllReservations);
router.post("/", reservationController.createReservation);
router.post("/:reservationId/apply", reservationController.applyReservation);
router.post("/:reservationId/comments", reservationController.addComment);

module.exports = router;
