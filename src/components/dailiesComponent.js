import React, { useEffect } from "react";
import ActivityItem from "./activityItem";
import { supabase } from "../lib/supabaseClient";


const DailiesComponent = ({user_id, resetRefs}) => {
  const [dailyActivities, setDailyActivities] = React.useState([]);
  useEffect(() => {
    const fetchDailies = async () => {
      const {data: dailiesData, error} = await supabase.from("activities").select(`name, id, category`).eq("category", "Dailies").order("name", { ascending: true });
      if(error){
        console.error("Error fetching daily activities:", error);
        return;
      }
      setDailyActivities(dailiesData);
      console.log("Daily activities fetched:", dailiesData);
    }
    fetchDailies();
  }, [user_id]);
  return (
    <div>
      <h3>Dailies</h3>
      <div
        className="flex-wrap justify-start mx-auto"
      >
        {dailyActivities.map((activity) => (
          <ActivityItem user_id={user_id} name={activity.name} category={activity.category} activity_id={activity.id} resetRefs={resetRefs} />
        ))}
      </div>
    </div>
  );
};

export default DailiesComponent;
