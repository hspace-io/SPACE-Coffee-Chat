import React from "react";

const DAYS = ["월","화","수","목","금","토","일"];

function pad(n){ return String(n).padStart(2,'0'); }

function genTimes(startHour, endHour){
  const arr = [];
  for(let h=startHour; h<=endHour; h++){
    arr.push(`${pad(h)}:00`);
    if(!(h===endHour)) arr.push(`${pad(h)}:30`);
  }
  return arr;
}

function weekdayIndexFromISO(isoDate){
  const d = new Date(isoDate);
  const js = d.getDay();
  return (js === 0) ? 6 : js - 1;
}

function timeFromISO(iso){
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function sameWeekIndex(iso){ return weekdayIndexFromISO(iso); }

function slotIndexFromTime(slotTimes, timeStr){
  return slotTimes.indexOf(timeStr);
}

export default function CalendarSchedule({
  reservations = [],
  onApply = ()=>{},
  startHour = 7,
  endHour = 22,
}) {
  const times = genTimes(startHour, endHour);
  const rows = times.length;

  const blocks = reservations
    .map(r => {
      const dayIdx = sameWeekIndex(r.startTime);
      const st = timeFromISO(r.startTime);
      const et = timeFromISO(r.endTime);
      let startSlot = slotIndexFromTime(times, st);
      let endSlot = slotIndexFromTime(times, et);

      if(startSlot === -1 || endSlot === -1){
        const sParts = st.split(':').map(Number);
        const eParts = et.split(':').map(Number);
        const startMinutes = sParts[0]*60 + sParts[1];
        const endMinutes = eParts[0]*60 + eParts[1];
        startSlot = Math.round((startMinutes - startHour*60)/30);
        const slotCount = Math.round((endMinutes - startMinutes)/30);
        return { id: r.id, dayIdx, startSlot, slotCount, r };
      }

      const slotCount = Math.max(1, endSlot - startSlot);
      return { id: r.id, dayIdx, startSlot, slotCount, r };
    })
    .filter(b => b.startSlot >= 0 && b.startSlot < rows && b.slotCount > 0);

  const map = Array.from({length:7},()=>Array(rows).fill(null));
  blocks.forEach(b => {
    map[b.dayIdx][b.startSlot] = { ...b, isHead: true };
    for(let i=1;i<b.slotCount;i++){
      if(b.startSlot + i < rows) map[b.dayIdx][b.startSlot + i] = { ...b, isHead: false };
    }
  });

  const now = new Date();

  return (
    <div className="overflow-auto border rounded-lg">
      <table className="min-w-full table-fixed border-collapse">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            <th className="w-20 border p-2 text-sm">시간</th>
            {DAYS.map((d, i) => (
              <th key={d} className="border p-2 text-sm text-center">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((time, rowIdx) => (
            <tr key={time} className="align-top">
              <td className="border p-1 text-xs text-center align-top">{time}</td>

              {Array.from({length:7}).map((_, dayIdx) => {
                const cell = map[dayIdx][rowIdx];

                // 빈 슬롯: 클릭 시 모달 열기
                if(cell === null){
                  return (
                    <td key={`${dayIdx}-${rowIdx}`} className="border h-12 p-1 text-sm align-top">
                      <div className="h-full w-full flex items-center justify-center text-xs text-blue-00 cursor-pointer"
                           onClick={()=>onApply(null)}>
                        빈 슬롯
                      </div>
                    </td>
                  );
                }

                const r = cell.r;
                const isPast = new Date(r.startTime) <= now;
                const isFull = r.currentPeople >= r.maxPeople;

                if(cell.isHead){
                  const height = `${Math.max(1, cell.slotCount) * 3}rem`;
                  return (
                    <td key={`${dayIdx}-${rowIdx}`} className="border p-1 align-top">
                      <div className="relative h-full">
                        <div
                          className="bg-yellow-100 border-l-4 border-yellow-400 p-2 rounded shadow-sm cursor-pointer"
                          style={{ minHeight: height }}
                          onClick={()=>onApply(r)}
                        >
                          <div className="text-sm font-semibold">{r.name}</div>
                          <div className="text-xs text-gray-600">
                            {new Date(r.startTime).toLocaleString()} - {new Date(r.endTime).toLocaleTimeString()}
                          </div>
                          <div className="text-xs mt-1">
                            {r.currentPeople}/{r.maxPeople}명
                          </div>
                          <div className="mt-2">
                            <button
                              className={`text-xs px-2 py-1 rounded ${!isPast && !isFull ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 cursor-not-allowed'}`}
                              disabled={isPast || isFull}
                              onClick={(e)=>{e.stopPropagation(); onApply(r);}}
                            >
                              {isFull ? "정원 마감" : isPast ? "신청 마감" : "신청"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  );
                }

                // occupied but not head
                return <td key={`${dayIdx}-${rowIdx}`} className="border p-1 bg-gray-50"></td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
