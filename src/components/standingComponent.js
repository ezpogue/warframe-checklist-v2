import React from "react";
import ActivityItem from "./activityItem";

const standingActivities = [
  { name: "Pledged Syndicate", key: "daily_pledge" },
  { name: "Ostron", key: "daily_ostron" },
  { name: "The Quills", key: "daily_quills" },
  { name: "Solaris United", key: "daily_solaris" },
  { name: "Ventkids", key: "daily_ventkids" },
  { name: "Vox Solaris", key: "daily_vox" },
  { name: "Entrati", key: "daily_entrati" },
  { name: "Necraloid", key: "daily_necraloid" },
  { name: "Cavia", key: "daily_cavia" },
  { name: "The Holdfasts", key: "daily_holdfasts" },
  { name: "The Hex", key: "daily_hex" },
  { name: "Cephalon Simaris", key: "daily_simaris" },
  { name: "Conclave", key: "daily_conclave" },
];

const StandingComponent = ({resetTrigger}) => {
  return (
    <div>
      <h3>Standing</h3>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          marginInline: "auto",
        }}
      >
        {standingActivities.map((activity) => (
          <ActivityItem name={activity.name} keyName={activity.key} key={activity.key} resetTrigger={resetTrigger} />
        ))}
      </div>
    </div>
  );
};

export default StandingComponent;
