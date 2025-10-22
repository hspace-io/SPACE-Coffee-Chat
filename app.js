const express = require("express");
const cors = require("cors");
const reservationRoutes = require("./routes/reservations.js");

const app = express();

// 🔹 배포 환경 CORS 설정
const allowedOrigins = ["http://192.168.10.140:3000"];
app.use(cors({
  origin: function(origin, callback) {
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

// 🔹 라우트 연결
app.use("/api/reservations", reservationRoutes);

module.exports = app;
