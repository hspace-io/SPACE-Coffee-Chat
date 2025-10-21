const express = require("express");
const cors = require("cors");
const reservationRoutes = require("./routes/reservations.js");
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api/reservations", reservationRoutes);

module.exports = app;
