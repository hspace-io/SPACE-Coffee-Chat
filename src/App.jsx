import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ReservationManager from './pages/ReservationManager';
import ReservationList from './pages/ReservationList';

function App() {
  // 현재 로그인한 사용자 (관리자 테스트용)
  const [currentUser] = useState({
    id: 1,
    name: '',
    email: '', 
    role: 'admin', 
  });

  return (
    <Router>
      <div className="p-4">
        {/* 네비게이션 */}
        <nav className="mb-4">
          <Link className="mr-4 text-blue-600" to="/">홈</Link>
          {currentUser.role === 'admin' && (
            <Link className="mr-4 text-blue-600" to="/reservation">예약 등록</Link>
          )}
          <Link className="text-blue-600" to="/list">예약 확인 / 신청</Link>
        </nav>

        <Routes>
          {/* Home 페이지에 currentUser 전달 */}
          <Route path="/" element={<Home currentUser={currentUser} />} />

          {/* 관리자 전용 예약 등록 페이지 */}
          {currentUser.role === 'admin' && (
            <Route 
              path="/reservation" 
              element={<ReservationManager currentUser={currentUser} />}
            />
          )}

          {/* 예약 확인 / 신청 페이지 */}
          <Route 
            path="/list" 
            element={<ReservationList currentUser={currentUser} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
