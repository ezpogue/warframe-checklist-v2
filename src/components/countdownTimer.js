import React, { useState, useEffect } from "react";

// Helper function to format time as HH:MM:SS
const formatTime = (timeInMs) => {
  const days = Math.floor(timeInMs / 1000 / 60 / 60 / 24); // Calculate days
  const hours = Math.floor((timeInMs / 1000 / 60 / 60) % 24); // Calculate hours
  const minutes = Math.floor((timeInMs / 1000 / 60) % 60); // Calculate minutes
  const seconds = Math.floor((timeInMs / 1000) % 60); // Calculate seconds
  
  return `${days.toString().padStart(2, "0")}:${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const toMillis = (t) => {
  if (t instanceof Date) return t.getTime();
  if (typeof t === "number") return t;
  return NaN;
};



// Function to calculate the next reset time based on current time
const CountdownTimer = ({ targetTime, title }) => {
  const [timeRemaining, setTimeRemaining] = useState(() => {
    const targetMs = toMillis(targetTime);
    return Number.isNaN(targetMs) ? 0 : Math.max(0, targetMs - Date.now());
  });

  useEffect(() => {
    if (!targetTime) return;

    const interval = setInterval(() => {
      const targetMs = toMillis(targetTime);
      if (Number.isNaN(targetMs)) return;

      setTimeRemaining(Math.max(0, targetMs - Date.now()));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  return (
    <div className="mb-4 text-center">
      <h4>{title}</h4>
        <div className="text-4xl font-bold">
        {formatTime(timeRemaining)}
      </div>
    </div>
  );
};




export default CountdownTimer;
