"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
}

const DAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTH_NAMES = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

function toYMD(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function todayYMD() {
  const t = new Date();
  return toYMD(t.getFullYear(), t.getMonth(), t.getDate());
}

export default function Calendar({ value, onChange, minDate }: CalendarProps) {
  const seed = value ? new Date(value + "T12:00:00") : new Date();
  const [year, setYear] = useState(seed.getFullYear());
  const [month, setMonth] = useState(seed.getMonth());

  const goBack = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const goForward = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  // Mon-first offset (0=Mon … 6=Sun)
  const firstOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const today = todayYMD();

  type Cell = { day: number; ymd: string; current: boolean };
  const cells: Cell[] = [];

  // Fill trailing days from prev month
  for (let i = 0; i < firstOffset; i++) {
    const d = daysInPrev - firstOffset + 1 + i;
    const pm = month === 0 ? 11 : month - 1;
    const py = month === 0 ? year - 1 : year;
    cells.push({ day: d, ymd: toYMD(py, pm, d), current: false });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, ymd: toYMD(year, month, d), current: true });
  }

  // Fill leading days from next month to complete 6 rows
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const nm = month === 11 ? 0 : month + 1;
    const ny = month === 11 ? year + 1 : year;
    cells.push({ day: d, ymd: toYMD(ny, nm, d), current: false });
  }

  return (
    <div className="cal-wrap">
      <div className="cal-header">
        <button type="button" className="cal-nav" onClick={goBack} aria-label="Previous month">
          <ChevronLeft size={15} />
        </button>
        <span className="cal-title">
          {MONTH_NAMES[month]} {year}
        </span>
        <button type="button" className="cal-nav" onClick={goForward} aria-label="Next month">
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="cal-grid">
        {DAY_LABELS.map((d) => (
          <div key={d} className="cal-dow">{d}</div>
        ))}

        {cells.map((cell, i) => {
          const disabled = !cell.current || (minDate ? cell.ymd < minDate : cell.ymd <= today);
          const selected = cell.ymd === value;
          const isToday = cell.ymd === today;

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onChange(cell.ymd)}
              className={[
                "cal-day",
                !cell.current && "cal-other",
                disabled && "cal-disabled",
                selected && "cal-selected",
                isToday && !selected && "cal-today",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
