import React, { use, useEffect, useRef, useState } from "react";
import usePersistentLocalStorage from "../hooks/usePersistentLocalStorage";
import { supabase } from "../lib/supabaseClient";
import {debounce, set} from "lodash";
import { useTheme } from "../lib/themeProvider.js";
import clsx from "clsx";

const ActivityItem = ({ user_id, name, category, activity_id, resetRefs }) => {
  const {theme} = useTheme();
  const [isCompleted, setIsCompleted] = useState(false);
  useEffect(() => {

    const fetchUserActivities = async () => {
      const {data:userActivitiesData, error } = await supabase.from("user_activities").select(`activity_id, completed`).eq("user_id", user_id).eq("activity_id", activity_id).single();
      if (error) {
        console.error("Error fetching user activities in category " + category + ":", error);
        return;
      }
      console.log("User activities fetched for activity_id " + activity_id + " and user_id " + user_id + ":", userActivitiesData);
      setIsCompleted(userActivitiesData.completed);
    };
    fetchUserActivities();
  }, [user_id, activity_id]);
  
  useEffect(() => {
    if (!debouncedUpdate.current) return;

    const handleReset = () => {
      setIsCompleted(false);
      debouncedUpdate.current(false);
    };

    if (category === "Dailies" || category === "Standing") {
      resetRefs.current[`Dailies_${activity_id}`] = handleReset;
    } else if (category === "Weeklies") {
      resetRefs.current[`Weeklies_${activity_id}`] = handleReset;
    }
  }, [category, resetRefs]);
  const debouncedUpdate = useRef(
    debounce(async (completed)  => {
      const{error} = await supabase.from("user_activities").update({completed}).eq("user_id", user_id).eq("activity_id", activity_id);
      if(error) { console.error("Error updating activity " + activity_id + " for user " + user_id + ":", error); }
    }, 300),
    [user_id, activity_id]
  );

  const handleCardClick = () => {
    setIsCompleted((prev => {
      const newState = !prev;
      debouncedUpdate.current(newState);
      return newState;
    }));
  };

  const getActivityItemStyles = (isCompleted) => clsx(
    'flex items-center p-3 m-0.5 rounded-lg shadow cursor-pointer relative flex-1 basis-[300px] max-w-[350px] min-w-[250px]',
    'transition-transform transition-border transition-shadow duration-300 border-4 hover:shadow-lg hover:scale-105',
    {
      'border-void-accent': isCompleted && theme === 'void',
      'border-void-border': !isCompleted && theme === 'void',
      'bg-void-card text-void-text': theme === 'void',
      'border-corpus-accent': isCompleted && theme === 'corpus',
      'border-corpus-border': !isCompleted && theme === 'corpus',
      'bg-corpus-card text-corpus-text': theme === 'corpus',
      'border-grineer-accent': isCompleted && theme === 'grineer',
      'border-grineer-border': !isCompleted && theme === 'grineer',
      'bg-grineer-card text-grineer-text': theme === 'grineer',
      'border-orokin-accent': isCompleted && theme === 'orokin',
      'border-orokin-border': !isCompleted && theme === 'orokin',
      'bg-orokin-card text-orokin-text': theme === 'orokin',
      'border-dark-accent': isCompleted && theme === 'dark',
      'border-dark-border': !isCompleted && theme === 'dark',
      'bg-dark-card text-dark-text': theme === 'dark',
      'border-classic-accent': isCompleted && theme === 'classic',
      'border-classic-border': !isCompleted && theme === 'classic',
      'bg-classic-card text-classic-text': theme === 'classic',
    }  
  );

  const getActivityCheckStyles = () => clsx(
    'absolute top-2.5 right-2.5 text-2xl',{
      'text-void-accent': theme === 'void',
      'text-corpus-accent': theme === 'corpus',
      'text-grineer-accent': theme === 'grineer',
      'text-orokin-accent': theme === 'orokin',
      'text-dark-accent': theme === 'dark',
      'text-classic-accent': theme === 'classic',
    }
  )

  return (
    <div
      onClick={handleCardClick}
      className={getActivityItemStyles(isCompleted)}
    >
      {isCompleted && (
        <div className={getActivityCheckStyles()}>
          ✔
        </div>
      )}
      <span className="break-words whitespace-normal">{name}</span>
    </div>
  );
};

export default ActivityItem;
