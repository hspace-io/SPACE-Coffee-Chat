require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const reservationRoutes = require('./routes/reservations');

const app = express();
const PORT = process.env.PORT || 4000;

// 미들웨어
app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB 연결 성공'))
.catch(err => console.error('MongoDB 연결 실패:', err));

// 예약 관련 라우트
app.use('/api/reservations', reservationRoutes);

app.get('/', (req, res) => {
  res.send('Random Coffee Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
