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

    console.log("DB 조회 결과:", fixedReservations.length, "개");
    res.json(fixedReservations);
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
      currentPeople: 0, // 초기값
      applicants: [],
      comments: []
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

    // applicants 배열 초기화
    if (!reservation.applicants) reservation.applicants = [];
    if (!reservation.currentPeople && reservation.currentPeople !== 0) reservation.currentPeople = 0;

    const exists = reservation.applicants.some(a => a.email === email);
    if (exists) return res.status(400).json({ message: "이미 신청했습니다." });

    if (reservation.currentPeople >= reservation.maxPeople)
      return res.status(400).json({ message: "정원이 이미 찼습니다." });

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

    if (!reservation.comments) reservation.comments = [];
    reservation.comments.push({ text });
    await reservation.save();

    console.log("댓글 추가 완료 ✅", reservationId);
    res.json({ message: "댓글 추가 완료" });
  } catch (err) {
    console.error("댓글 추가 실패 ❌", err);
    res.status(500).json({ message: "댓글 추가 실패", details: err.message });
  }
};
