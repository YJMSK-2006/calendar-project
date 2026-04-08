"use client";

import { useState, useEffect } from "react";

export default function PremiumCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [notes, setNotes] = useState("");
  const [dateNotes, setDateNotes] = useState({});
  const [selectedKey, setSelectedKey] = useState(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem("general-notes");
    const savedDateNotes = localStorage.getItem("date-notes");

    if (savedNotes) setNotes(savedNotes);
    if (savedDateNotes) setDateNotes(JSON.parse(savedDateNotes));
  }, []);

  useEffect(() => {
    localStorage.setItem("general-notes", notes);
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("date-notes", JSON.stringify(dateNotes));
  }, [dateNotes]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const handleClick = (day: number) => {
    const selected = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    setSelectedKey(selected.toDateString());

    if (!startDate || (startDate && endDate)) {
      setStartDate(selected);
      setEndDate(null);
    } else {
      if (selected < startDate) {
        setEndDate(startDate);
        setStartDate(selected);
      } else {
        setEndDate(selected);
      }
    }
  };

  const isBetween = (day: number) => {
    const d = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return startDate && endDate && d >= startDate && d <= endDate;
  };

  const isSame = (d1, d2) =>
    d1 && d2 && d1.toDateString() === d2.toDateString();

  const today = new Date();

  const changeMonth = (dir) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + dir);
    setCurrentDate(newDate);
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Hero */}
        <div className="relative h-56">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute bottom-0 left-0 w-full h-24 bg-blue-500"
            style={{ clipPath: "polygon(0 40%, 100% 0%, 100% 100%, 0% 100%)" }}
          ></div>

          <div className="absolute bottom-4 right-6 text-white text-right">
            <h1 className="text-xl font-light">{currentDate.getFullYear()}</h1>
            <h2 className="text-2xl font-bold">
              {currentDate.toLocaleString("default", { month: "long" })}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">

          {/* Notes */}
          <div className="p-4 md:p-6 border-b md:border-b-0 md:border-r bg-gray-50">
            <h2 className="font-semibold mb-2 text-gray-700">Notes</h2>

            {selectedKey && (
              <button
                onClick={() => setSelectedKey(null)}
                className="text-sm text-blue-500 mb-2 underline"
              >
                Switch to General Notes
              </button>
            )}

            {selectedKey && (
              <p className="text-sm mb-2 text-blue-600">
                Notes for: {selectedKey}
              </p>
            )}

            {/* ✅ FIXED TEXTAREA */}
            <textarea
              value={
                selectedKey
                  ? (dateNotes[selectedKey] ?? "")
                  : notes
              }
              onChange={(e) => {
                const value = e.target.value;

                if (selectedKey) {
                  setDateNotes((prev) => ({
                    ...prev,
                    [selectedKey]: value,
                  }));
                } else {
                  setNotes(value);
                }
              }}
              className="w-full h-40 p-3 border rounded-xl focus:outline-none 
                         bg-white text-gray-900 font-semibold placeholder-gray-400 shadow-sm"
              placeholder={
                selectedKey
                  ? "Write note for selected date..."
                  : "Write general notes..."
              }
            />

            {startDate && (
              <div className="mt-4 text-sm text-gray-700">
                <p><b>Start:</b> {startDate.toDateString()}</p>
                {endDate && <p><b>End:</b> {endDate.toDateString()}</p>}
              </div>
            )}
          </div>

          {/* Calendar */}
          <div className="col-span-2 p-4 md:p-6">

            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => changeMonth(-1)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                ◀
              </button>
              <button
                onClick={() => changeMonth(1)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                ▶
              </button>
            </div>

            <div className="grid grid-cols-7 text-center text-gray-700 font-semibold mb-2">
              {["MON","TUE","WED","THU","FRI","SAT","SUN"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {[...Array(firstDay === 0 ? 6 : firstDay - 1)].map((_, i) => (
                <div key={i}></div>
              ))}

              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;

                const inRange = isBetween(day);
                const isStart = isSame(
                  startDate,
                  new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                );
                const isEnd = isSame(
                  endDate,
                  new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                );

                const isToday =
                  day === today.getDate() &&
                  currentDate.getMonth() === today.getMonth() &&
                  currentDate.getFullYear() === today.getFullYear();

                return (
                  <div
                    key={day}
                    onClick={() => handleClick(day)}
                    className={`p-2 md:p-3 text-base md:text-lg rounded-xl text-center cursor-pointer transition font-medium
                      ${inRange ? "bg-blue-200 text-black" : "hover:bg-gray-100 text-gray-700"}
                      ${isStart || isEnd ? "bg-blue-600 text-white scale-105" : ""}
                      ${isToday ? "border-2 border-red-500" : ""}
                    `}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}