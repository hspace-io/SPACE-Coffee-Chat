const path = require("path");
const Reservation = require(path.join(__dirname, "..", "models", "Reservation.js"));

// 전체 예약 조회
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().lean();

    console.log("DB 조회 결과:", reservations.length, "개"); // 조회된 개수 확인
    if (!reservations.length) {
      console.warn("DB에 예약 데이터가 없습니다!");
    }

    res.json(reservations.map(r => ({ ...r, id: r._id })));
  } catch (err) {
    console.error("DB 조회 실패 ❌", err);
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
      return res.status(400).json({ message: "필수 필드 누락" });
    }

    const newReservation = await Reservation.create({
      name,
      memo,
      startTime,
      endTime,
      maxPeople,
    });

    console.log("예약 생성 ✅", newReservation._id);
    res.status(201).json({ ...newReservation.toObject(), id: newReservation._id });
  } catch (err) {
    console.error("예약 생성 실패 ❌", err);
    res.status(500).json({ error: "예약 생성 실패", details: err.message });
  }
};

// 예약 신청
exports.applyReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { email, nickname } = req.body;
    if (!email || !nickname) return res.status(400).json({ message: "이메일과 닉네임 필요" });

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ message: "예약 없음" });

    const exists = reservation.applicants.some(a => a.email === email);
    if (exists) return res.status(400).json({ message: "이미 신청했습니다." });

    reservation.applicants.push({ email, nickname });
    reservation.currentPeople += 1;
    await reservation.save();

    console.log("예약 신청 완료 ✅", reservationId, email);
    res.json({ message: "예약 신청 완료" });
  } catch (err) {
    console.error("예약 신청 실패 ❌", err);
    res.status(500).json({ message: "예약 신청 실패", details: err.message });
  }
};

// 댓글 추가
exports.addComment = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "댓글 내용 필요" });

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ message: "예약 없음" });

    reservation.comments.push({ text });
    await reservation.save();

    console.log("댓글 추가 완료 ✅", reservationId);
    res.json({ message: "댓글 추가 완료" });
  } catch (err) {
    console.error("댓글 추가 실패 ❌", err);
    res.status(500).json({ message: "댓글 추가 실패", details: err.message });
  }
};
