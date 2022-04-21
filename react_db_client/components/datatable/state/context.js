import React from 'react';
// TODO: Implement defaults
export const TableStateContext = React.createContext({});
export const TableMethodsContext = React.createContext({});

export function useGetTableContext({ rowIndex, columnIndex }) {
  const { onCellKeyPress, onCellChange, onCellAccept, onCellReset, onCellSelect, onCellHover } =
    useContext(TableMethodsContext);

  const rcount = useRef(0);
  rcount.current += 1;

  const {
    tableData,
    currentFocusedRow,
    currentFocusedColumn,
    navigationMode,
    editMode,
    invalidRowsMessages,
  } = useContext(TableStateContext);

  return {
    tableState,
    modelState,
  };
}
