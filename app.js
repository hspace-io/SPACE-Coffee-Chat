// app.js
const express = require("express");
const cors = require("cors");
const reservationRoutes = require("./routes/reservations.js");

const app = express();

// 🔹 CORS 설정
const corsOptions = {
  origin: "http://192.168.10.140:3000", // 프론트 주소
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 🔹 Preflight 요청 처리
app.options("*", cors(corsOptions));

// 🔹 JSON 바디 파싱
app.use(express.json());

// 🔹 안전하게 라우트 연결
// 경로 문자열에 ':' 없음 → path error 방지
app.use("/api/reservations", reservationRoutes);

module.exports = app;
