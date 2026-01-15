import React, { useEffect } from "react";
import ActivityItem from "./activityItem";
import { supabase } from "../lib/supabaseClient";


const StandingComponent = ({user_id, resetRefs}) => {
  const [standingActivities, setStandingActivities] = React.useState([]);
  useEffect(() => {
    const fetchStandings = async () => {
      const {data: standingData, error} = await supabase.from("activities").select(`name, id, category`).eq("category", "Standing").order("name", { ascending: true });
      if(error){
        console.error("Error fetching standing activities:", error);
        return;
      }
      setStandingActivities(standingData);
      console.log("Standing activities fetched:", standingData);
    }
    fetchStandings();
  }, [user_id]);  
  return (
    <div>
      <h3>Standing</h3>
      <div
        className="flex-wrap justify-start mx-auto"
      >
        {standingActivities.map((activity) => (
          <ActivityItem user_id={user_id} name={activity.name} category={activity.category} activity_id={activity.id} resetRefs={resetRefs} />
        ))}
      </div>
    </div>
  );
};

export default StandingComponent;
