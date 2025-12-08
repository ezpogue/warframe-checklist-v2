import React from "react";
import ActivityItem from "./activityItem";

const weeklyActivities = [
  { name: "Trade in Riven Slivers", key: "weekly_slivers" },
  { name: "Maroo Hunt", key: "weekly_maroo" },
  { name: "Kahl Mission", key: "weekly_kahl" },
  { name: "Archon Hunt", key: "weekly_archon" },
  { name: "Netracells", key: "weekly_netracells" },
  { name: "Deep Archimedea", key: "weekly_eda" },
  { name: "Temporal Archimedea", key: "weekly_eta" },
  { name: "1999 Calendar", key: "weekly_calendar" },
  { name: "Nightwave Weekly", key: "weekly_nw" },
  { name: "Circuit", key: "weekly_circuit" },
  { name: "Steel Path Circuit", key: "weekly_sp-circuit" },
  { name: "Trade in Steel Essence", key: "weekly_teshin" },
  { name: "Buy Archon Shard from Bird 3", key: "weekly_bird3" },
];

const WeekliesComponent = ({resetTrigger}) => {
  return (
    <div>
      <h3>Weeklies</h3>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          marginInline: "auto",
        }}
      >
        {weeklyActivities.map((activity) => (
          <ActivityItem name={activity.name} keyName={activity.key} key={activity.key} resetTrigger={resetTrigger} />
        ))}
      </div>
    </div>
  );
};

export default WeekliesComponent;
