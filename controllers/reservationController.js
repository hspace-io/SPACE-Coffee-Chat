const path = require("path");
const Reservation = require(path.join(__dirname, "..", "models", "Reservation.js"));

// 전체 예약 조회
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().lean();

    // currentPeople이 없는 경우 0으로 초기화
    const fixedReservations = reservations.map(r => ({
      ...r,
      currentPeople: r.currentPeople || 0,
      id: r._id
    }));

    // 콘솔에서 깨지지 않도록 JSON.stringify
    console.log("DB 조회 결과:", JSON.stringify(fixedReservations, null, 2));

    // UTF-8 인코딩 명시
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.json(fixedReservations);
  } catch (err) {
    console.error("DB 조회 실패 ❌", err);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(500).json({ 
      error: "DB 조회 실패", 
      details: err.message 
    });
  }
};

// 예약 생성
exports.createReservation = async (req, res) => {
  try {
    const { name, memo, startTime, endTime, maxPeople } = req.body;
    if (!name || !startTime || !endTime) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      return res.status(400).json({ message: "필수 필드 누락" });
    }

    const newReservation = await Reservation.create({
      name,
      memo,
      startTime,
      endTime,
      maxPeople,
      currentPeople: 0, // 초기값
      applicants: [],
      comments: []
    });

    console.log("예약 생성 ✅", JSON.stringify(newReservation, null, 2));
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(201).json({ ...newReservation.toObject(), id: newReservation._id });
  } catch (err) {
    console.error("예약 생성 실패 ❌", err);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(500).json({ error: "예약 생성 실패", details: err.message });
  }
};

// (applyReservation, addComment도 동일하게 필요하면 UTF-8 헤더 추가 가능)
