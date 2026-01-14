import {useMemo} from "react";

const useSearchFilter = ({
    items = [],
    searchQuery = '',
    selectedItems = {},
    hideSelected = false,
    moveSelectedToEnd = false,
}) => {
    return useMemo(() => {
        console.log(items);
        let result = items.filter((item) => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if(hideSelected){
            result = result.filter((item) => !selectedItems[item.name]);
        }

        if (moveSelectedToEnd) {
            result.sort((a, b) => {
              const aSelected = selectedItems[a.name] || false;
              const bSelected = selectedItems[b.name] || false;
      
              if (aSelected !== bSelected) {
                return aSelected ? 1 : -1;
              }
      
              return 0;
            });
        }

        return result;
    }, [items, searchQuery, selectedItems, hideSelected, moveSelectedToEnd]);
};

export default useSearchFilter;