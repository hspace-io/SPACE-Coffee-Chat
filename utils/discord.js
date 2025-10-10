const axios = require("axios");

async function sendDiscordMessage(message) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return console.warn("Discord Webhook URL 미설정");

  try {
    await axios.post(webhookUrl, { content: message });
    console.log("✅ Discord 메시지 전송 성공");
  } catch (error) {
    console.error("❌ Discord 메시지 전송 실패:", error);
  }
}

module.exports = sendDiscordMessage;
