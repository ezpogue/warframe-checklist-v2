import React, { useState, useEffect } from "react";
import ChecklistCard from "./checklistItem.js";
import { withPrefix } from "gatsby";
import usePersistentLocalStorage from "../hooks/usePersistentLocalStorage.js"
import useSearchFilter from "../hooks/searchFilter.js";

const WeaponsTab = ({ searchQuery, moveSelectedToEnd, hideSelected }) => {
  const localStorageKey = "weaponsKey";
  const [weapons, setWeapons] = useState([]);
  const [selectedItems, setSelectedItems] = usePersistentLocalStorage(localStorageKey);

  useEffect(() => {
    async function fetchWeapons() {
      const response = await fetch(withPrefix("/data/weapons.json"));
      const data = await response.json();
      const excluded = ["Lato Prime", "Skana Prime"]
      const included = ["Catchmoon", "Gaze", "Rattleguts", "Sporelacer", "Tombfinger", "Vermisplicer", "Dokrahm", "Rabvee", "Sepfahn", "Plague Keewar", "Plague Kripath"]
      const filtered = data.filter((weapon) => (weapon.masterable === true || included.includes(weapon.name)) && !excluded.includes(weapon.name));
      setWeapons(filtered);
    }

    fetchWeapons();
  }, []);

  const handleSelectionChange = (weaponName, isSelected) => {
    setSelectedItems((prev) => ({
      ...prev,
      [weaponName]: isSelected,
    }));
  };

  const filteredWeapons = useSearchFilter({
    items: weapons,
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
        {filteredWeapons.map((weapon) => (
          <div key={weapon.uniqueName} style={{ maxWidth: "330px" }}>
            <ChecklistCard
              name={weapon.name}
              imageName={weapon.imageName}
              components={weapon.components}
              wiki={weapon.wikiaUrl}
              isSelected={selectedItems[weapon.name] || false} // Pass current selection state
              onSelectionChange={handleSelectionChange} // Pass the callback function to update the parent state
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeaponsTab;
