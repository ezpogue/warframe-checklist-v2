import { useMemo } from "react";

const useSearchFilter = ({
  items = [],
  searchQuery = '',
  selectedItems = {},
  hideSelected = false,
  moveSelectedToEnd = false,
}) => {
  return useMemo(() => {
    let processed = items.map(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const isSelected = !!selectedItems[item.id];
      const hidden = !matchesSearch || (hideSelected && isSelected);

      return { ...item, hidden, isSelected };
    });

    if (moveSelectedToEnd) {
      processed.sort((a, b) => {
        if (a.isSelected !== b.isSelected) {
          return a.isSelected ? 1 : -1;
        }
        return 0;
      });
    }

    return processed;
  }, [items, searchQuery, selectedItems, hideSelected, moveSelectedToEnd]);
};

export default useSearchFilter;
