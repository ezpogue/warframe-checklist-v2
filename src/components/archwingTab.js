import React, { useState, useEffect } from "react";
import ChecklistCard from "./checklistItem.js";
import { withPrefix } from "gatsby";
import usePersistentLocalStorage from "../hooks/usePersistentLocalStorage.js"
import useSearchFilter from "../hooks/searchFilter.js";

const ArchwingsTab = ({ searchQuery, moveSelectedToEnd, hideSelected }) => {
  const localStorageKey = "archwingsKey";
  const [archwings, setArchwings] = useState([]);
  const [selectedItems, setSelectedItems] = usePersistentLocalStorage(localStorageKey);

  useEffect(() => {
    async function fetchArchwings() {
      const response = await fetch(withPrefix("/data/archwing.json"));
      const data = await response.json();
      setArchwings(data);
    }

    fetchArchwings();
  }, []);

  const handleSelectionChange = (archwingName, isSelected) => {
    setSelectedItems((prev) => ({
      ...prev,
      [archwingName]: isSelected,
    }));
  };

  const filteredArchwings = useSearchFilter({
    items: archwings,
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
        {filteredArchwings.map((archwing) => (
          <div key={archwing.uniqueName} style={{ maxWidth: "330px" }}>
            <ChecklistCard
              name={archwing.name}
              imageName={archwing.imageName}
              components={archwing.components}
              wiki={archwing.wikiaUrl}
              isSelected={selectedItems[archwing.name] || false}
              onSelectionChange={handleSelectionChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArchwingsTab;
