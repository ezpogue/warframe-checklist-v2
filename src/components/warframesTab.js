import React, { useState, useEffect } from "react";
import ChecklistCard from "./checklistItem.js";
import useSearchFilter from "../hooks/searchFilter.js";
import { supabase } from "../lib/supabaseClient";

const WarframesTab = ({ searchQuery, moveSelectedToEnd, hideSelected, user_id }) => {
  const [warframes, setWarframes] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    if (!user_id) return;
    const fetchWarframes = async () => {
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
    setSelectedItems((prev) => ({
      ...prev,
      [warframeName]: isSelected,
    }));
  };

  const excluded = ["Helminth", "Excalibur Prime"];
  const filteredWarframes = useSearchFilter({
    items: warframes.filter(wf => !excluded.includes(wf.name)),
    searchQuery,
    selectedItems,
    hideSelected,
    moveSelectedToEnd,
  });

  return (
    <div style={{ margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "flex-start",
          marginInline: "auto",
        }}
      >
        {filteredWarframes.map((warframe) => (
          <div key={warframe.id} style={{ maxWidth: "340px" }}>
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
