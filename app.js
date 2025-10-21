const express = require("express");
const cors = require("cors");
const reservationRoutes = require("./routes/reservations.js");

const app = express();

// CORS 허용
app.use(cors({ origin: "*" }));
app.use(express.json());

// 라우트 연결
app.use("/api/reservations", reservationRoutes);

module.exports = app;
