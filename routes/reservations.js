const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController.js");

// DB 전체 예약 조회
router.get("/", reservationController.getAllReservations);

// 예약 생성
router.post("/", reservationController.createReservation);

// 예약 신청
router.post("/:reservationId/apply", reservationController.applyReservation);

// 댓글 추가
router.post("/:reservationId/comments", reservationController.addComment);

module.exports = router;
