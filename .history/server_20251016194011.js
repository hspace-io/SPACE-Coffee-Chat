const mongoose = require("mongoose");
const app = require("./app");

require("dotenv").config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

// DB 연결 후 서버 실행
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("✅ MongoDB 연결 성공");
    app.listen(PORT, "0.0.0.0", () => console.log(`🚀 서버 실행 중: ${PORT}`));
  })
  .catch(err => {
    console.error("❌ MongoDB 연결 실패:", err);
  });
