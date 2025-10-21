const path = require("path");
const Reservation = require(path.join(__dirname, "..", "models", "Reservation.js"));

// 전체 예약 조회
async function getAllReservations(req, res) {
  try {
    const reservations = await Reservation.find().lean();
    const fixedReservations = reservations.map(r => ({
      ...r,
      currentPeople: r.currentPeople || 0,
      id: r._id
    }));

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.json(fixedReservations);
  } catch (err) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(500).json({ error: "DB 조회 실패", details: err.message });
  }
}

// 예약 생성
async function createReservation(req, res) { /* 기존 코드 그대로 */ }
async function applyReservation(req, res) { /* 기존 코드 그대로 */ }
async function addComment(req, res) { /* 기존 코드 그대로 */ }

module.exports = {
  getAllReservations,
  createReservation,
  applyReservation,
  addComment
};
