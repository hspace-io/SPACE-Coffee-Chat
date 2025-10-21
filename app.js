const express = require("express");
const cors = require("cors");
const reservationRoutes = require("./routes/reservations.js");

const app = express();

// 🔹 CORS 설정
app.use(cors({
  origin: ["http://192.168.10.140:3000"], // 프론트 주소
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

// JSON 바디 파싱
app.use(express.json());

// 라우트 연결
app.use("/api/reservations", reservationRoutes);

// OPTIONS preflight 요청 자동 응답
app.options("*", cors());

module.exports = app;
