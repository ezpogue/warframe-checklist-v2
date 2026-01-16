import React, { useEffect } from "react";
import ActivityItem from "./activityItem";
import { supabase } from "../lib/supabaseClient";


const WeekliesComponent = ({user_id, resetRefs}) => {
  const [weeklyActivities, setWeeklyActivities] = React.useState([]);
  useEffect(() => {
    const fetchWeeklies = async () => {
      const {data: weekliesData, error} = await supabase.from("activities").select(`name, id, category`).eq("category", "Weeklies").order("name", { ascending: true });
      if(error){
        console.error("Error fetching weekly activities:", error);
        return;
      }
      setWeeklyActivities(weekliesData);
      //console.log("Weekly activities fetched:", weekliesData);
    }
    fetchWeeklies();
  }, [user_id]);
  return (
    <div>
      <h3>Weeklies</h3>
      <div
        className="flex-wrap justify-start mx-auto"
      >
        {weeklyActivities.map((activity) => (
          <ActivityItem user_id={user_id} name={activity.name} category={activity.category} activity_id={activity.id} resetRefs={resetRefs} />
        ))}
      </div>
    </div>
  );
};

export default WeekliesComponent;
