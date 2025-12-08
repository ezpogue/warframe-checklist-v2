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


// Function to calculate the next reset time based on current time
const getNextResetTime = (resetTime) => {
  const now = new Date();
  const targetTime = new Date(resetTime);
  if (now > targetTime) {
    targetTime.setUTCDate(targetTime.getUTCDate() + 1); // Move to the next day
  }
  
  return targetTime;
};

const CountdownTimer = ({ resetTime, title }) => {
  const [timeRemaining, setTimeRemaining] = useState(() => {
    const nextResetTime = getNextResetTime(resetTime);
    return nextResetTime - Date.now(); // Initialize with the time difference
  });

  useEffect(() => {
    const updateRemainingTime = () => {
      const nextResetTime = getNextResetTime(resetTime);
      const newTimeRemaining = nextResetTime - Date.now();

      if (newTimeRemaining <= 0) {
        setTimeRemaining(0);
      } else {
        setTimeRemaining(newTimeRemaining);
      }
    };

    // Update immediately when the component is mounted
    updateRemainingTime();

    // Update every second
    const interval = setInterval(updateRemainingTime, 1000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [resetTime]);

  return (
    <div style={{ marginBottom: "1rem", textAlign: "center" }}>
      <h4>{title}</h4>
      <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
        {formatTime(timeRemaining)}
      </div>
    </div>
  );
};

export default CountdownTimer;
