import React, { useState, useEffect, useRef } from "react";
import ChecklistCard from "./checklistItem.js";
import useSearchFilter from "../hooks/searchFilter.js";
import { supabase } from "../lib/supabaseClient";
import debounce from "lodash/debounce";

const WarframesTab = ({ searchQuery, moveSelectedToEnd, hideSelected, user_id }) => {
  const [warframes, setWarframes] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    if (!user_id) return;
    const fetchWarframes = async () => {
      console.log("Fetching Warframes");
      const{data: warframeData, error: warframeError} = await supabase.from("items").select(`id, name, img_name, category, product_category, wikia_url, masterable`).eq("category", "Warframes").order("name", { ascending: true });
      console.log("Warframes fetched:", warframeData);

      if(warframeError){
        console.error("Error fetching Warframes:", warframeError);
        return;
      }

      const warframeIDs = warframeData.map(wf => wf.id);

      const {data: userWarframes, error: userWarframesError} = await supabase.from("user_items").select("item_id, owned").eq("user_id", user_id).in("item_id", warframeIDs);
      if(userWarframesError){
        console.error("Error fetching user Warframes:", userWarframesError);
        return;
      }

      const ownedMap = {};
      userWarframes.forEach((row) => {
        const match = warframeData.find(wf => wf.id === row.item_id);
        if(match) ownedMap[match.name] = row.owned;
      })

      setWarframes(warframeData);
      setSelectedItems(ownedMap);
    };
    fetchWarframes();
  }, [user_id]);

  const handleSelectionChange = (warframeName, isSelected) => {
     setSelectedItems((prev) => {
      const newState = { ...prev, [warframeName]: isSelected };

      const warframe = warframes.find(w => w.name === warframeName);
      if (!warframe) return newState;

      pendingUpdates.current.push({
      user_id,
      item_id: warframe.id,
      owned: isSelected
    });

      debouncedUpdate();

      return newState;
    });
  };
  const excluded = ["Helminth", "Excalibur Prime"];
  const filteredWarframes = useSearchFilter({
    items: warframes.filter(wf => !excluded.includes(wf.name)),
    searchQuery,
    selectedItems,
    hideSelected,
    moveSelectedToEnd,
  });

  const pendingUpdates = useRef([]);
  const debouncedUpdate = useRef(
  debounce(async () => {
    if (pendingUpdates.current.length === 0) return;

    const updates = [...pendingUpdates.current];
    pendingUpdates.current = [];

    try {
      for (const update of updates) {
        const { user_id, item_id, owned } = update;
        //console.log("Updating item:", update);
        const { data, error } = await supabase
          .from("user_items")
          .update({ owned })
          .eq("user_id", user_id)
          .eq("item_id", item_id);

        if (error) console.error("Error updating user item:", error);
        else console.log("Updated user item:", data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }, 500)
).current;

  return (
    <div className="max-w-[1400px] mx-auto px-4">
      <div
      className="grid gap-4 justify-center" 
       style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
      >
        {filteredWarframes.map((warframe) => (
          <div key={warframe.id} >
            <ChecklistCard
              item_id={warframe.id}
              name={warframe.name}
              imageName={warframe.img_name}
              wiki={warframe.wikia_url}
              isSelected={selectedItems[warframe.name] || false}
              onSelectionChange={handleSelectionChange}
              user_id={user_id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WarframesTab;
