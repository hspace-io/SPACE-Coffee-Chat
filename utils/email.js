const nodemailer = require("nodemailer");

let transporter;

async function initTransporter() {
  if (transporter) return;

  // 테스트용 계정 생성
  const testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  console.log("✅ Nodemailer 테스트용 초기화 완료");
  console.log("사용자:", testAccount.user, "비밀번호:", testAccount.pass);
}

async function sendEmail(to, subject, text) {
  await initTransporter();

  try {
    const info = await transporter.sendMail({
      from: `"예약 시스템" <test@example.com>`,
      to,
      subject,
      text,
    });

    console.log("✅ 이메일 전송 성공:", to);
    console.log("📧 Preview URL:", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("❌ 이메일 전송 실패:", to, error);
  }
}

module.exports = sendEmail;
