import React, { useState, useEffect, useRef, useCallback } from "react";
import ChecklistCard from "./checklistItem.js";
import useSearchFilter from "../hooks/searchFilter.js";
import { supabase } from "../lib/supabaseClient";
import debounce from "lodash/debounce";

const WeaponsTab = ({ searchQuery, moveSelectedToEnd, hideSelected, user_id }) => {
  const [weapons, setWeapons] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    if (!user_id) return;
    const fetchWeapons = async () => {
      console.log("Fetching Weapons");
      let page = 0;
      let weaponData = [];
      const batchsize = 1000;
      let fetched;
      do {
        const{data: weaponBatch, error: weaponError} = await supabase.from("items").select(`id, name, img_name, category, product_category, wikia_url, masterable`).in("category", ["Primary", "Secondary", "Melee", "Misc"])
          .order("name", { ascending: true }).range(page * batchsize, (page + 1) * batchsize - 1);
        if(weaponError) throw weaponError;
        fetched = weaponBatch.length;
        weaponData = weaponData.concat(weaponBatch);
        page++;
      } while (fetched === batchsize);
      //console.log("Weapons fetched:", weaponData);

      const weaponIDs = weaponData.map(w => w.id);
      //console.log("Weapon IDs:", weaponIDs);
      //console.log("User ID:", user_id);

      const chunkSize = 100;
      let userWeapons = [];

      for (let i = 0; i < weaponIDs.length; i += chunkSize) {
        const chunk = weaponIDs.slice(i, i + chunkSize);
        const { data, error } = await supabase
          .from("user_items")
          .select("item_id, owned")
          .eq("user_id", user_id)
          .in("item_id", chunk);

        if (error) {
          console.error("Error fetching user Weapons chunk:", error);
          continue;
        }
        userWeapons = userWeapons.concat(data);
      }

      const ownedMap = {};
      userWeapons.forEach((row) => {
        ownedMap[row.item_id] = row.owned;
      })

      setWeapons(weaponData);
      setSelectedItems(ownedMap);
    };
    fetchWeapons();
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

  const handleSelectionChange = useCallback((weaponId, isSelected) => {
     setSelectedItems((prev) => {
      const newState = { ...prev, [weaponId]: isSelected };

      pendingUpdates.current.push({
      user_id,
      item_id: weaponId,
      owned: isSelected
    });

      debouncedUpdate();

      return newState;
    });
  }, [weapons, user_id, debouncedUpdate]);
  const excluded = ["Lato Prime", "Skana Prime", "Ekwana Ii Jai", "Ekwana Ii Ruhang", "Ekwana Jai", "Ekwana Jai Ii", "Ekwana Ruhang", "Ekwana Ruhang Ii",
    "Jai", "Jai Ii", "Ruhang", "Ruhang Ii", "Vargeet Ruhang", "Vargeet Jai", "Vargeet Ii Ruhang", "Vargeet Ii Jai", "Vargeet Ruhang Ii",
    "Vargeet Jai Ii", "Jayap", "Korb", "Kroostra", "Kwath", "Laka", "Peye", "Seekalla", "Shtung", "Plague Akwin", "Plague Bokwin",
    "Feverspine", "Bad Baby", "Flatbelly", "Needlenose", "Runway"];
  const included = ["Balla", "Cyath", "Dehtat", "Dokrahm", "Kronsh", "Mewan", "Ooltha", "Rabvee", "Sepfahn", "Plague Keewar", "Plague Kripath", "Sporelacer", "Vermisplicer"];
  const filteredWeapons = useSearchFilter({
    items: weapons.filter(w => (!excluded.includes(w.name) && w.masterable) || included.includes(w.name)).filter(w => !w.id.includes("PvP")&&!w.id.includes("DoppelgangerGrimoire")),
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
        {filteredWeapons.map((weapon) => (
          <div key={weapon.id} className={weapon.hidden ? "hidden" : "block"}>
            <ChecklistCard
              item_id={weapon.id}
              name={weapon.name}
              imageName={weapon.img_name}
              wiki={weapon.wikia_url}
              isSelected={selectedItems[weapon.id] || false}
              onSelectionChange={handleSelectionChange}
              user_id={user_id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeaponsTab;
