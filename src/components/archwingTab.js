import React, { useState, useEffect, useRef, useCallback } from "react";
import ChecklistCard from "./checklistItem.js";
import useSearchFilter from "../hooks/searchFilter.js";
import { supabase } from "../lib/supabaseClient";
import debounce from "lodash/debounce";

const ArchwingTab = ({ searchQuery, moveSelectedToEnd, hideSelected, user_id }) => {
  const [archwing, setArchwing] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    if (!user_id) return;
    const fetchArchwing = async () => {
      console.log("Fetching Archwing");
      let page = 0;
      let archwingData = [];
      const batchsize = 1000;
      let fetched;
      do {
        const{data: archwingBatch, error: archwingError} = await supabase.from("items").select(`id, name, img_name, category, product_category, wikia_url, masterable`).in("category", ["Arch-Gun", "Arch-Melee", "Archwing", "Misc"])
          .order("name", { ascending: true }).range(page * batchsize, (page + 1) * batchsize - 1);
        if(archwingError) throw archwingError;
        fetched = archwingBatch.length;
        archwingData = archwingData.concat(archwingBatch);
        page++;
      } while (fetched === batchsize);
      console.log("Archwing fetched:", archwingData);

      const archwingIDs = archwingData.map(w => w.id);
      //console.log("Archwing IDs:", archwingIDs);
      //console.log("User ID:", user_id);

      const chunkSize = 100;
      let userArchwings = [];

      for (let i = 0; i < archwingIDs.length; i += chunkSize) {
        const chunk = archwingIDs.slice(i, i + chunkSize);
        const { data, error } = await supabase
          .from("user_items")
          .select("item_id, owned")
          .eq("user_id", user_id)
          .in("item_id", chunk);

        if (error) {
          console.error("Error fetching user Archwing chunk:", error);
          continue;
        }
        userArchwings = userArchwings.concat(data);
      }

      const ownedMap = {};
      userArchwings.forEach((row) => {
        const match = archwingData.find(w => w.id === row.item_id);
        if(match) ownedMap[match.name] = row.owned;
      })

      setArchwing(archwingData);
      setSelectedItems(ownedMap);
    };
    fetchArchwing();
  }, [user_id]);

  const handleSelectionChange = useCallback((archwingName, isSelected) => {
     setSelectedItems((prev) => {
      const newState = { ...prev, [archwingName]: isSelected };

      const archwing = archwing.find(w => w.name === archwingName);
      if (!archwing) return newState;

      pendingUpdates.current.push({
      user_id,
      item_id: archwing.id,
      owned: isSelected
    });

      debouncedUpdate();

      return newState;
    });
  }, []);
  const excluded = ["Catchmoon", "Gaze", "Rattleguts", "Tombfinger"];
  const included = ["Raplak Prism", "Shwaak Prism", "Granmu Prism", "Rahn Prism", "Cantic Prism", "Lega Prism", "Klamora Prism"];
  const filteredArchwings = useSearchFilter({
    items: archwing.filter(a => (!excluded.includes(a.name) && a.masterable) || included.includes(a.name)),
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
    <div className="mx-auto px-4">
      <div
      className="grid gap-5 justify-center grid-cols-[repeat(auto-fill,minmax(300px,1fr))]" 
      >
        {filteredArchwings.map((archwing) => (
          <div key={archwing.id} className={archwing.hidden ? "hidden" : "block"}>
            <ChecklistCard
              item_id={archwing.id}
              name={archwing.name}
              imageName={archwing.img_name}
              wiki={archwing.wikia_url}
              isSelected={selectedItems[archwing.name] || false}
              onSelectionChange={handleSelectionChange}
              user_id={user_id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArchwingTab;
