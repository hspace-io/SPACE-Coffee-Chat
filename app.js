const express = require("express");
const cors = require("cors");
const reservationRoutes = require("./routes/reservations.js");

const app = express();

// ✅ CORS 설정 — 완전 버전
const corsOptions = {
  origin: "http://192.168.10.140:3000", // 프론트 주소
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// ✅ Preflight(OPTIONS) 요청 명시적 처리
app.options("*", cors(corsOptions));

// ✅ JSON 바디 파싱
app.use(express.json());

// ✅ 라우트 연결
app.use("/api/reservations", reservationRoutes);

module.exports = app;
