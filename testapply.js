require("dotenv").config();
const sendEmail = require("./utils/email");

async function test() {
  const to = "본인테스트메일@example.com"; // 본인 확인용 메일
  const subject = "예약 시스템 테스트";
  const text = "이 메일은 예약 시스템 테스트용 이메일입니다.";

  try {
    await sendEmail(to, subject, text);
    console.log("테스트 이메일 전송 완료");
  } catch (err) {
    console.error("테스트 이메일 전송 실패", err);
  }
}

test();
