const express = require("express");
const router = express.Router();
const reservationController = require("./controllers/reservationController");

router.get("/", reservationController.getAllReservations);
router.post("/", reservationController.createReservation);
router.post("/:reservationId/apply", reservationController.applyReservation);
router.post("/:reservationId/comments", reservationController.addComment);

module.exports = router;
