const express = require("express");
const cors = require("cors");
const reservationRoutes = require("./routes/reservations.js");

const app = express();

// 🔹 CORS 설정
const corsOptions = {
  origin: "http://192.168.10.140:3000", // 프론트 주소
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};
app.use(cors(corsOptions));

// JSON 바디 파싱
app.use(express.json());

// 라우트 연결
app.use("/api/reservations", reservationRoutes);

// ✅ app.options("*", cors()) 제거: cors 미들웨어가 preflight 자동 처리

module.exports = app;
