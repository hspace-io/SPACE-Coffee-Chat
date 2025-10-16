const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

const reservationRoutes = require(path.join(__dirname, "routes", "reservations.js"));
app.use("/api/reservations", reservationRoutes);

module.exports = app;
