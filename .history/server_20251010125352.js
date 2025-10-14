const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const reservationRoutes = require("./routes/reservations");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

// DB 연결
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// 미들웨어
app.use(cors());
app.use(express.json());

// 라우트
app.use("/api/reservations", reservationRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
