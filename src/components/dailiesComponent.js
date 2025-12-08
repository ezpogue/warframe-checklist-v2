import React from "react";
import ActivityItem from "./activityItem";

const dailyActivities = [
  { name: "Sortie", key: "daily_sortie" },
  { name: "Incursions", key: "daily_incursions" },
  { name: "Duviri Harvest", key: "daily_duviri" },
  { name: "1999 Dating Sim", key: "daily_dating" },
  { name: "Nightwave Daily", key: "daily_nw-daily" },
  { name: "Focus Cap", key: "daily_focus" },
  { name: "Check Tenet Melees", key: "daily_tenet" },
  { name: "Check Coda Weapons", key: "daily_coda" },
];

const DailiesComponent = ({resetTrigger}) => {
  return (
    <div>
      <h3>Dailies</h3>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          marginInline: "auto",
        }}
      >
        {dailyActivities.map((activity) => (
          <ActivityItem name={activity.name} keyName={activity.key} key={activity.key} resetTrigger={resetTrigger} />
        ))}
      </div>
    </div>
  );
};

export default DailiesComponent;
