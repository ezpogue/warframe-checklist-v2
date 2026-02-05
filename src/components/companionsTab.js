import React, { useState, useEffect, useRef, useCallback } from "react";
import ChecklistCard from "./checklistItem.js";
import useSearchFilter from "../hooks/searchFilter.js";
import { supabase } from "../lib/supabaseClient";
import debounce from "lodash/debounce";

const CompanionsTab = ({ searchQuery, moveSelectedToEnd, hideSelected, user_id }) => {
  const [companions, setCompanions] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    if (!user_id) return;
    const fetchCompanions = async () => {
      console.log("Fetching Companions");
      let page = 0;
      let companionsData = [];
      const batchsize = 1000;
      let fetched;
      do {
        const{data: companionsBatch, error: companionsError} = await supabase.from("items").select(`id, name, img_name, category, product_category, wikia_url, masterable`).in("category", ["Pets", "Sentinels", "SentinelWeapons"])
          .order("name", { ascending: true }).range(page * batchsize, (page + 1) * batchsize - 1);
        if(companionsError) throw companionsError;
        fetched = companionsBatch.length;
        companionsData = companionsData.concat(companionsBatch);
        page++;
      } while (fetched === batchsize);
      //console.log("Companions fetched:", companionsData);
      
      const companionsIDs = companionsData.map(w => w.id);
      //console.log("Companions IDs:", companionsIDs);
      //console.log("User ID:", user_id);

      const chunkSize = 100;
      let userCompanions = [];

      for (let i = 0; i < companionsIDs.length; i += chunkSize) {
        const chunk = companionsIDs.slice(i, i + chunkSize);
        const { data, error } = await supabase
          .from("user_items")
          .select("item_id, owned")
          .eq("user_id", user_id)
          .in("item_id", chunk);

        if (error) {
          console.error("Error fetching user Companions chunk:", error);
          continue;
        }
        userCompanions = userCompanions.concat(data);
      }

      const ownedMap = {};
      userCompanions.forEach((row) => {
        ownedMap[row.item_id] = row.owned;
      })

      setCompanions(companionsData);
      setSelectedItems(ownedMap);
    };
    fetchCompanions();
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

  const handleSelectionChange = useCallback((companionId, isSelected) => {
     setSelectedItems((prev) => {
      const newState = { ...prev, [companionId]: isSelected };

      pendingUpdates.current.push({
      user_id,
      item_id: companionId,
      owned: isSelected
    });

      debouncedUpdate();

      return newState;
    });
  }, [companions, user_id, debouncedUpdate]);
  const excluded = [];
  const included = [];
  const filteredCompanions = useSearchFilter({
    items: companions.filter(c => (!excluded.includes(c.name) && c.masterable) || included.includes(c.name)),
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
        {filteredCompanions.map((companion) => (
          <div key={companion.id} className={companion.hidden ? "hidden" : "block"}>
            <ChecklistCard
              item_id={companion.id}
              name={companion.name}
              imageName={companion.img_name}
              wiki={companion.wikia_url}
              isSelected={selectedItems[companion.id] || false}
              onSelectionChange={handleSelectionChange}
              user_id={user_id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanionsTab;
