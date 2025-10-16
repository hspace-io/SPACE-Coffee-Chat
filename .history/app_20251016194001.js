const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();

// 미들웨어
app.use(cors({ origin: "*" }));
app.use(express.json());

// 라우트
const reservationRoutes = require(path.join(__dirname, "routes", "reservations.js"));
app.use("/api/reservations", reservationRoutes);

module.exports = app;
