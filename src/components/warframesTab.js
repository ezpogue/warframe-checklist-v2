import React, { useState, useEffect, useRef, useCallback } from "react";
import ChecklistCard from "./checklistItem.js";
import useSearchFilter from "../hooks/searchFilter.js";
import { supabase } from "../lib/supabaseClient";
import debounce from "lodash/debounce";
import { useTheme } from "../lib/themeProvider.js";


const WarframesTab = ({ searchQuery, moveSelectedToEnd, hideSelected, user_id }) => {
  const { theme } = useTheme();
  const [warframes, setWarframes] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    if (!user_id) return;
    const fetchWarframes = async () => {
      //console.log("Fetching Warframes");
      const{data: warframeData, error: warframeError} = await supabase.from("items").select(`id, name, img_name, category, product_category, wikia_url, masterable`).eq("category", "Warframes").order("name", { ascending: true });
      //console.log("Warframes fetched:", warframeData);

      if(warframeError){
        console.error("Error fetching Warframes:", warframeError);
        return;
      }

      const warframeIDs = warframeData.map(wf => wf.id);

      const chunkSize = 100;
      let userWarframes = [];

      for (let i = 0; i < warframeIDs.length; i += chunkSize) {
        const chunk = warframeIDs.slice(i, i + chunkSize);
        const { data, error } = await supabase
          .from("user_items")
          .select("item_id, owned")
          .eq("user_id", user_id)
          .in("item_id", chunk);

        if (error) {
          console.error("Error fetching user Warframes chunk:", error);
          continue;
        }
        userWarframes = userWarframes.concat(data);
      }

      const ownedMap = {};
      userWarframes.forEach((row) => {
        ownedMap[row.item_id] = row.owned;
      })

      setWarframes(warframeData);
      setSelectedItems(ownedMap);
    };
    fetchWarframes();
  }, [user_id]);

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
        //else console.log("Updated user item:", data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }, 500)
).current;

  const handleSelectionChange = useCallback((warframeId, isSelected) => {
     setSelectedItems((prev) => {
      const newState = { ...prev, [warframeId]: isSelected };

      pendingUpdates.current.push({
      user_id,
      item_id: warframeId,
      owned: isSelected
    });

      debouncedUpdate();

      return newState;
    });
  }, [warframes, user_id, debouncedUpdate]);
  const excluded = ["Helminth", "Excalibur Prime"];
  const included = [];
  const filteredWarframes = useSearchFilter({
    items: warframes.filter(wf => !excluded.includes(wf.name) || included.includes(wf.name)),
    searchQuery,
    selectedItems,
    hideSelected,
    moveSelectedToEnd,
  });

  return (
    <div className="mx-auto px-4">
      <div
      className="grid gap-5 justify-center grid-cols-[repeat(auto-fill,minmax(300px,1fr))]" 
      >
        {filteredWarframes.map((warframe) => (
          <div key={warframe.id} className={warframe.hidden ? "hidden" : "block"}>
            <ChecklistCard
              item_id={warframe.id}
              name={warframe.name}
              imageName={warframe.img_name}
              wiki={warframe.wikia_url}
              isSelected={selectedItems[warframe.id] || false}
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
