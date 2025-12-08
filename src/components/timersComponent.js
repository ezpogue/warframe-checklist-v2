import React from "react";
import CountdownTimer from "./countdownTimer.js";

const TimersComponent = () => {
  const nextDailyReset = new Date().setUTCHours(24, 0, 0, 0);
  const nextWeeklyReset = new Date(new Date().setUTCDate(new Date().getUTCDate() + (7 - new Date().getUTCDay()) % 7 || 7)).setUTCHours(24, 0, 0, 0); //00:00:00 Monday UTC
  const nextBaroArrival = new Date();
  // Set to Friday (the next Friday after today)
  const currentWeek = Math.floor(nextBaroArrival.getUTCDate() / 14);
  nextBaroArrival.setUTCDate(nextBaroArrival.getUTCDate() + (5 - nextBaroArrival.getUTCDay() + 7) % 7);
  if (currentWeek % 2 !== 0) {
    nextBaroArrival.setUTCDate(nextBaroArrival.getUTCDate() );
  }
  nextBaroArrival.setUTCHours(13, 0, 0, 0);

  const nextBaroDeparture = new Date();
  // Set to the Sunday following Baro arrival
  nextBaroDeparture.setUTCDate(nextBaroDeparture.getUTCDate() + (5 - nextBaroDeparture.getUTCDay() + 7) % 7);
  if (currentWeek % 2 !== 0) {
    nextBaroDeparture.setUTCDate(nextBaroDeparture.getUTCDate() + 2);
  }
  nextBaroDeparture.setUTCHours(13, 0, 0, 0);
  
  const now = new Date()
  const isBaroHere = now >= nextBaroArrival && now < nextBaroDeparture;

  const nextErgoRotation = new Date(Date.UTC(
  new Date().getUTCFullYear(),
  new Date().getUTCMonth(),
  new Date().getUTCDate() + (((4 - ((new Date().getUTCDate() - 3) % 4 + 4) % 4) || 4))
));
  const nextEleanorRotation = new Date(Date.UTC(
  new Date().getUTCFullYear(),
  new Date().getUTCMonth(),
  new Date().getUTCDate() + (((4 - ((new Date().getUTCDate() - 1) % 4 + 4) % 4) || 4))
));





  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: ".75rem",
        margin: ".2rem",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        border: "3px solid #ccc",
        cursor: "pointer",
        flex: "1 1 300px",
        maxWidth: "350px",
        minWidth: "250px",
        position: "relative",
      }}
    >
      <CountdownTimer title="Daily Reset In:" resetTime={nextDailyReset} />
      <CountdownTimer title="Weekly Reset In:" resetTime={nextWeeklyReset} />
      {isBaroHere ? (<CountdownTimer title="Baro Ki'Teer Departs In:" resetTime={nextBaroDeparture} />) : (<CountdownTimer title="Baro Ki'Teer Returns In:" resetTime={nextBaroArrival} />)}
      <CountdownTimer title="Ergo Glast's Wares Rotate In:" resetTime={nextErgoRotation}/>
      <CountdownTimer title="Eleanor's Wares Rotate In:" resetTime={nextEleanorRotation}/>
    </div>
  );
};

export default TimersComponent;
