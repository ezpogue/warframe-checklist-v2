import React from "react";
import CountdownTimer from "./countdownTimer.js";
import { useTheme } from "../lib/themeProvider.js";
import clsx from "clsx";

const TimersComponent = () => {
  const { theme } = useTheme();
  const nextDailyReset = new Date().setUTCHours(24, 0, 0, 0);
  const nextWeeklyReset = new Date(new Date().setUTCDate(new Date().getUTCDate() + (7 - new Date().getUTCDay()) % 7 || 7)).setUTCHours(24, 0, 0, 0); //00:00:00 Monday UTC
  const WEEK = 7 * 24 * 60 * 60 * 1000;
  const BIWEEK = 2 * WEEK;
  const TWODAYS = 2 * 24 * 60 * 60 * 1000;
  const FOURDAYS = 4 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const BARO_ANCHOR = Date.UTC(2026, 0, 9, 14, 0, 0); // January 9, 2026 at 14:00 UTC
  const biweekIndex = Math.floor((now - BARO_ANCHOR) / BIWEEK);
  const nextBaroArrival = new Date(BARO_ANCHOR + (biweekIndex + 1) * BIWEEK);
  const nextBaroDeparture = new Date(nextBaroArrival.getTime() + TWODAYS);
  const isBaroHere = now >= nextBaroArrival && now < nextBaroDeparture;

  const ERGO_ANCHOR = Date.UTC(2026, 0, 11, 0, 0, 0); // January 12, 2026 at 00:00 UTC
  const ELEANOR_ANCHOR = Date.UTC(2026, 0, 13, 0, 0, 0); // January 14, 2026 at 00:00 UTC
  const fourdayErgoIndex = Math.floor((now - ERGO_ANCHOR) / FOURDAYS);
  const fourdayEleanorIndex = Math.floor((now - ELEANOR_ANCHOR) / FOURDAYS);
  const nextErgoRotation = new Date(ERGO_ANCHOR + (fourdayErgoIndex + 1) * FOURDAYS);
  const nextEleanorRotation = new Date(ELEANOR_ANCHOR + (fourdayEleanorIndex + 1) * FOURDAYS);

  const getTimerCardStyles = () => clsx(
    'flex flex-col items-center p-3 m-1 rounded-lg shadow-md flex-1 max-w-sm min-w-64 border-4 cursor-default',
    {
      'bg-void-card text-void-text border-void-border': theme === 'void',
      'bg-corpus-card text-corpus-text border-corpus-border': theme === 'corpus',
      'bg-grineer-card text-grineer-text border-grineer-border': theme === 'grineer',
      'bg-orokin-card text-orokin-text border-orokin-border': theme === 'orokin',
      'bg-dark-card text-dark-text border-dark-border': theme === 'dark',
      'bg-classic-card text-classic-text border-classic-border': theme === 'classic',
    }
  );

  return (
    <div className={getTimerCardStyles()}>
      <CountdownTimer title="Daily Reset In:" targetTime={nextDailyReset} />
      <CountdownTimer title="Weekly Reset In:" targetTime={nextWeeklyReset} />
      {isBaroHere ? (<CountdownTimer title="Baro Ki'Teer Departs In:" targetTime={nextBaroDeparture} />) : (<CountdownTimer title="Baro Ki'Teer Returns In:" targetTime={nextBaroArrival} />)}
      <CountdownTimer title="Ergo Glast's Wares Rotate In:" targetTime={nextErgoRotation}/>
      <CountdownTimer title="Eleanor's Wares Rotate In:" targetTime={nextEleanorRotation}/>
    </div>
  );
};

export default TimersComponent;
