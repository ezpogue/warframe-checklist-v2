import React, {useState} from "react";
import DailiesComponent from "./dailiesComponent.js";
import WeekliesComponent from "./weekliesComponent.js";
import StandingComponent from "./standingComponent.js";
import TimersComponent from "./timersComponent.js";



const ActivitiesTab = () => {

    const [dailyResetTrigger, setDailyResetTrigger] = useState(0);
    const [weeklyResetTrigger, setWeeklyResetTrigger] = useState(0);

    const handleResetDailies = () => {
        setDailyResetTrigger((prev) => prev + 1);
    };
    
    const handleResetWeeklies = () => {
        setWeeklyResetTrigger((prev) => prev + 1);
    };

    const buttonStyle = {
        backgroundColor: "#3a3f4b", // Lighter slate gray
        color: "#f0f0f0",           // Very light gray text
        border: "1px solid #888",   // Metallic subtle border
        padding: "0.75rem 1.5rem",
        fontSize: "1rem",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        textAlign: "center",
        fontWeight: "bold",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      };
      
      const buttonHoverStyle = {
        backgroundColor: "#5a9fd4", // Accent blue on hover
        color: "#ffffff",           // Crisp white text
      };
      
      
    
      const handleMouseEnter = (e) => {
        e.target.style.backgroundColor = buttonHoverStyle.backgroundColor;
      };
    
      const handleMouseLeave = (e) => {
        e.target.style.backgroundColor = buttonStyle.backgroundColor;
      };

  return (
    <div style={{ margin: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1rem",
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", justifyContent: "center" }}>
                <button 
                    style={buttonStyle}
                    onClick={handleResetDailies}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}>
                    Reset Dailies
                </button>
                <button 
                    style={buttonStyle}
                    onClick={handleResetWeeklies}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}>
                    Reset Weeklies
                </button>
          </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "1rem" }}>
            <TimersComponent />
            </div>
        </div>
        
        <div style={{ flex: 1 }}>
          <DailiesComponent resetTrigger={{daily: dailyResetTrigger}}/>
        </div>

        <div style={{ flex: 1 }}>
          <StandingComponent resetTrigger={{daily: dailyResetTrigger}}/>
        </div>

        <div style={{ flex: 1 }}>
          <WeekliesComponent resetTrigger={{ weekly: weeklyResetTrigger }}/>
        </div>

      </div>
    </div>
  );
};

export default ActivitiesTab;
