const cron = require("node-cron");
const Reservation = require("./models/Reservations");
const sendEmail = require("./utils/email");

// 1분마다 실행
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const fiveMinLater = new Date(now.getTime() + 5 * 60 * 1000);

    const upcomingReservations = await Reservation.find({
      startTime: { $gte: now, $lte: fiveMinLater },
    });

    for (const r of upcomingReservations) {
      // 신청자 알림
      r.participants.forEach((p) => {
        sendEmail(
          p.email,
          `[곧 시작] ${r.name}`,
          `예약이 5분 후 시작됩니다.\n닉네임: ${p.nickname}\n시간: ${new Date(r.startTime).toLocaleString()}`
        );
      });

      // 관리자 알림
      if (r.creatorEmail) {
        sendEmail(
          r.creatorEmail,
          `[예약 시작 알림] ${r.name}`,
          `예약이 5분 후 시작됩니다.\n총 인원: ${r.currentPeople}/${r.maxPeople}`
        );
      }
    }
  } catch (err) {
    console.error("예약 시작 알림 스케줄 오류:", err);
  }
});
