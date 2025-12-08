import React, { useState, useEffect } from "react";
import ChecklistCard from "./checklistItem.js";
import { withPrefix } from "gatsby";
import usePersistentLocalStorage from "../hooks/usePersistentLocalStorage.js"
import useSearchFilter from "../hooks/searchFilter.js";

const CompanionsTab = ({ searchQuery, moveSelectedToEnd, hideSelected }) => {
  const localStorageKey = "companionsKey";
  const [companions, setCompanions] = useState([]);
  const [selectedItems, setSelectedItems] = usePersistentLocalStorage(localStorageKey);

  useEffect(() => {
    async function fetchCompanions() {
      const response = await fetch(withPrefix("/data/companions.json"));
      const data = await response.json();
      const filtered = data.filter((companion) => companion.masterable === true);
      setCompanions(filtered);
    }

    fetchCompanions();
  }, []);

  const handleSelectionChange = (companionName, isSelected) => {
    setSelectedItems((prev) => ({
      ...prev,
      [companionName]: isSelected,
    }));
  };

  const filteredCompanions = useSearchFilter({
    items: companions,
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
        {filteredCompanions.map((companion) => (
          <div key={companion.uniqueName} style={{ maxWidth: "330px" }}>
            <ChecklistCard
              name={companion.name}
              imageName={companion.imageName}
              components={companion.components}
              wiki={companion.wikiaUrl}
              isSelected={selectedItems[companion.name] || false}
              onSelectionChange={handleSelectionChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanionsTab;
