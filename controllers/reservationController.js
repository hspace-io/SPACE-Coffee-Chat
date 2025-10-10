const Reservation = require("../models/Reservation");
const sendEmail = require("../utils/email");
const sendDiscordMessage = require("../utils/discord")

// 예약 신청
exports.applyReservation = async (req, res) => {
  const { reservationId } = req.params;
  const { email, nickname } = req.body;

  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ message: "예약 없음" });

    if (reservation.currentPeople >= reservation.maxPeople)
      return res.status(400).json({ message: "정원 마감" });

    const alreadyApplied = reservation.applicants.some(a => a.email === email);
    if (alreadyApplied) return res.status(400).json({ message: "이미 신청함" });

    // DB 저장
    reservation.applicants.push({ email, nickname });
    reservation.currentPeople += 1;
    await reservation.save();

    // 프론트 성공 응답 먼저
    res.status(200).json(reservation);

    const adminEmails = ["hyeon@hspace.io"];
    const applicantList = reservation.applicants.map(a => `${a.nickname} <${a.email}>`).join(", ");

    // 신청자 즉시 이메일
    sendEmail(
      email,
      `[예약 확정] ${reservation.name}`,
      `예약이 확정되었습니다.\n예약 시간: ${new Date(reservation.startTime).toLocaleString()} ~ ${new Date(reservation.endTime).toLocaleString()}`
    ).catch(console.error);

    // 관리자 즉시 이메일
    sendEmail(
      adminEmails.join(","),
      `[예약 상태] ${reservation.name}`,
      `예약 업데이트\n현재 정원: ${reservation.currentPeople}/${reservation.maxPeople}\n신청자: ${applicantList}`
    ).catch(console.error);

    // 예약 시작 5분 전 알림
    const timeUntilAlert = new Date(reservation.startTime).getTime() - Date.now() - 5 * 60 * 1000;
    if (timeUntilAlert > 0) {
      setTimeout(() => {
        // 신청자 알림
        sendEmail(
          email,
          `[곧 시작] ${reservation.name}`,
          `예약 시작 5분 전입니다! 예약 시간: ${new Date(reservation.startTime).toLocaleString()}`
        ).catch(console.error);

        // 관리자 알림
        sendEmail(
          adminEmails.join(","),
          `[곧 시작] ${reservation.name}`,
          `예약 ${reservation.name}가 5분 후 시작합니다.\n신청자: ${applicantList}`
        ).catch(console.error);
      }, timeUntilAlert);
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "예약 신청 실패" });
  }
};

// 예약 목록
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "예약 불러오기 실패" });
  }
};

// 예약 생성
exports.createReservation = async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    res.status(201).json(reservation);

    const frontUrl = "http://localhost:3000/list";
    const message = `☕\n예약명: ${reservation.name}\n예약 신청: ${frontUrl}?applyId=${reservation._id}\n시간: ${new Date(reservation.startTime).toLocaleString()} ~ ${new Date(reservation.endTime).toLocaleString()}\n최대 인원: ${reservation.maxPeople}`;
    sendDiscordMessage(message);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "예약 생성 실패" });
  }
};

// 댓글 추가
exports.addComment = async (req, res) => {
  const { reservationId } = req.params;
  const { text } = req.body;

  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ message: "예약 없음" });

    reservation.comments.push({ text });
    await reservation.save();
    res.json({ comments: reservation.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "댓글 추가 실패" });
  }
};
