import React, {useState, useRef} from "react";
import DailiesComponent from "./dailiesComponent.js";
import WeekliesComponent from "./weekliesComponent.js";
import StandingComponent from "./standingComponent.js";
import TimersComponent from "./timersComponent.js";
import { useTheme } from "../lib/themeProvider.js";
import clsx from "clsx";


const ActivitiesTab = ({user_id}) => {
  const { theme } = useTheme();
  const resetRefs= useRef({});
  if(!user_id) return(null);
  const handleReset = (category) => {
    Object.entries(resetRefs.current).forEach(([key, resetFn]) => {
      if (key.startsWith(category)) {
        resetFn();
      }
    });
  };

  const getResetButtonStyles = () => clsx(
    "border px-6 py-3 text-base rounded-lg cursor-pointer transition-all duration-300 text-center font-bold shadow-md",{
    'bg-void-hover text-void-card border-void-hover hover:bg-void-primary': theme === 'void',
    'bg-corpus-hover text-corpus-card border-corpus-hover hover:bg-corpus-primary': theme === 'corpus',
    'bg-grineer-hover text-grineer-card border-grineer-hover hover:bg-grineer-primary': theme === 'grineer',
    'bg-orokin-hover text-orokin-card border-orokin-hover hover:bg-orokin-primary': theme === 'orokin',
    'bg-dark-hover text-dark-card border-dark-hover hover:bg-dark-primary': theme === 'dark',
    'bg-classic-hover text-classic-card border-classic-hover hover:bg-classic-primary': theme === 'classic',
  });


  return (
    <div className="m-4">
      <div className="flex space-between mt-4"
      >
        <div className="flex-1">
          <div className="flex gap-2 mt-4 justify-center">
                <button 
                    className={getResetButtonStyles()}
                    onClick={() => handleReset("Dailies")}>
                    Reset Dailies
                </button>
                <button 
                    className={getResetButtonStyles()}
                    onClick={() =>  handleReset("Weeklies")}>
                    Reset Weeklies
                </button>
          </div>
            <div className="flex justify-center items-center mt-4">
            <TimersComponent />
            </div>
        </div>

        <div className="flex-1">
          {<DailiesComponent user_id={user_id} resetRefs={resetRefs}/>}
        </div>

        <div className="flex-1">
          <StandingComponent user_id={user_id} resetRefs={resetRefs}/>
        </div>

        <div className="flex-1">
          <WeekliesComponent user_id={user_id} resetRefs={resetRefs}/>
        </div>

      </div>
    </div>
  );
};

export default ActivitiesTab;
