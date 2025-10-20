import { useState, useEffect } from "react";
import axios from "axios";

export const useReservations = () => {
  const [allReservations, setAllReservations] = useState([]);
  const [futureReservations, setFutureReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://192.168.10.140:4000/api/reservations");
      const all = res.data.map((r) => ({ ...r, id: r._id }));
      setAllReservations(all);
      setFutureReservations(all.filter((r) => new Date(r.startTime) > new Date()));
    } catch (err) {
      console.error(err);
      alert("예약 데이터를 가져오는데 실패했습니다.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return { allReservations, futureReservations, fetchReservations, loading };
};
