// server.js
require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

// 🔹 MongoDB 연결
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("✅ MongoDB connected");
    // 🔹 서버 실행 (0.0.0.0 → 외부 접근 가능)
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://192.168.10.140:${PORT}`);
    });
  })
  .catch(err => console.error("❌ MongoDB connection error", err));
