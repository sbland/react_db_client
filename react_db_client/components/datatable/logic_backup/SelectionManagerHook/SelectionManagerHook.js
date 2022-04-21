import { useCallback, useEffect, useState } from 'react';

const useSelectionManager = ({ onSelectionChange, data, dataProcessed, selectionOverride }) => {
  const [currentSelectionIds, setCurrentSelectionIds] = useState(selectionOverride);

  useEffect(() => {
    setCurrentSelectionIds(selectionOverride);
  }, [selectionOverride]);
  useEffect(() => {
    /* When processed data changes we check all selection is visable */
    const newSelection = currentSelectionIds.filter((id) => {
      return dataProcessed.find((d) => d.uid === id);
    });
    if (newSelection.length !== currentSelectionIds.length) {
      setCurrentSelectionIds(newSelection);
      onSelectionChange(newSelection.map((uid) => data.find((rowData) => rowData.uid === uid)));
    }
  }, [dataProcessed, currentSelectionIds, data, onSelectionChange]);

  const addToSelection = useCallback(
    // eslint-disable-next-line no-unused-vars
    (rowId, _rowIndex) => {
      setCurrentSelectionIds((prev) => {
        const newSelection = [...prev, rowId];

        onSelectionChange(newSelection.map((uid) => data.find((rowData) => rowData.uid === uid)));
        return newSelection;
      });
    },
    [data, onSelectionChange]
  );

  const removeFromSelection = useCallback(
    // eslint-disable-next-line no-unused-vars
    (rowId, _rowIndex) => {
      setCurrentSelectionIds((prev) => {
        const newSelection = prev.filter((item) => item !== rowId);
        onSelectionChange(newSelection.map((uid) => data.find((rowData) => rowData.uid === uid)));
        return newSelection;
      });
    },
    [data, onSelectionChange]
  );

  const clearSelection = useCallback(() => {
    onSelectionChange([]);
    setCurrentSelectionIds([]);
  }, [onSelectionChange]);

  const selectAll = useCallback(() => {
    const newSelection = dataProcessed.map((d) => d.uid);
    onSelectionChange(newSelection.map((uid) => data.find((rowData) => rowData.uid === uid)));
    setCurrentSelectionIds(newSelection);
  }, [dataProcessed, onSelectionChange, data]);

  return {
    // currentSelection,
    currentSelectionIds,
    addToSelection,
    removeFromSelection,
    clearSelection,
    selectAll,
  };
};
export default useSelectionManager;
