const express = require("express");
const cors = require("cors");
const reservationRoutes = require("./routes/reservations.js");

const app = express();

// 🔹 배포 환경 프론트 도메인 설정
const allowedOrigins = ["http://192.168.10.140:3000"]; // 보내주신 배포 프론트 주소

app.use(cors({
  origin: function(origin, callback) {
    // Postman이나 서버 요청의 경우 origin이 없을 수 있음
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: Origin not allowed"));
    }
  },
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// 🔹 Preflight 요청 처리
app.options("*", cors());

// 🔹 JSON 바디 파싱
app.use(express.json());

// 🔹 예약 라우트 연결
app.use("/api/reservations", reservationRoutes);

module.exports = app;
