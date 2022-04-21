import { useState, useMemo } from 'react';

export const useHandleTableState = ({ columns, initialData }) => {
  const [editMode, setEditMode] = useState(false);
  const [navigationMode, setNavigationMode] = useState(true);
  const [currentFocusedColumn, setCurrentFocusedColumn] = useState(0);
  const [currentFocusedRow, setCurrentFocusedRow] = useState(0);

  const tableState = useMemo(
    () => ({
      tableData: initialData,
      editMode,
      navigationMode,
      currentFocusedColumn,
      currentFocusedRow,
    }),
    [editMode, navigationMode, currentFocusedColumn, currentFocusedRow]
  );

  const handleMoveFocusToTargetCell = (i, j) => {
    setCurrentFocusedColumn(j);
    setCurrentFocusedRow(i);
  };

  const onCellKeyPress = (e, rowIndex, columnIndex) => {
    const atEndOfRow = columnIndex === columns.length - 1;
    const atStartOfRow = columnIndex === 0;
    const atTopRow = rowIndex === 0;
    const atBottomRow = rowIndex === tableState.tableData.length - 1;
    if (navigationMode) {
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          if (!atEndOfRow) handleMoveFocusToTargetCell(rowIndex, columnIndex + 1);
          else handleMoveFocusToTargetCell(rowIndex, columnIndex);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (!atStartOfRow) handleMoveFocusToTargetCell(rowIndex, columnIndex - 1);
          else handleMoveFocusToTargetCell(rowIndex, columnIndex);
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!atTopRow) handleMoveFocusToTargetCell(rowIndex - 1, columnIndex);
          else handleMoveFocusToTargetCell(rowIndex, columnIndex);
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!atBottomRow) handleMoveFocusToTargetCell(rowIndex + 1, columnIndex);
          else handleMoveFocusToTargetCell(rowIndex, columnIndex);
          // TODO: If at bottom row then add new row
          break;
        case 'Enter':
          e.preventDefault();
          onCellSelect(e, rowIndex, columnIndex);
          break;
        default:
          break;
      }
    } else {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          setNavigationMode(true);
          setEditMode(false);
          handleMoveFocusToTargetCell(rowIndex, columnIndex);
          break;
        default:
          break;
      }
    }
  };

  const onCellChange = () => {
    //
    /* Cell -onChange */
    // onCellChange useCallback(
    //   (onCellAccept) => handleValueChange(newValue, rowData.uid, rowIndex, headingData.uid),
    //   [onCellResetueChange, rowData.uid, rowIndex, headingData.uid]
    // );
  };

  const onCellAccept = (newValue, rowIndex, columnIndex) => {
    console.log('ACCEPT');
    setNavigationMode(true);
    setEditMode(false);
    // TODO: handle accept value
    // handleValueAccept(newValue, rowData.uid, rowIndex, headingData.uid);
    // handleMoveFocusToTargetCell(rowIndex, columnIndex);
    // cellWrapNavBtnRef.current.focus();
  };
  const onCellReset = (e, rowIndex, columnIndex) => {
    console.log('RESET ' + rowIndex + ' ' + columnIndex + ' ' + columns[columnIndex].label);
    setNavigationMode(true);
    setEditMode(false);
    // TODO: Handle reset
    // handleValueReset(rowData.uid, rowIndex, headingData.uid);
  };
  const onCellSelect = (e, rowIndex, columnIndex) => {
    console.log('SELECT ' + rowIndex + ' ' + columnIndex);
    setCurrentFocusedRow(rowIndex);
    setCurrentFocusedColumn(columnIndex);
    setNavigationMode(false);
    setEditMode(true);
  };
  const onCellHover = (e, rowIndex, columnIndex) => {
    if (navigationMode) {
      setCurrentFocusedRow(rowIndex);
      setCurrentFocusedColumn(columnIndex);
    }
  };

  const methods = {
    onCellKeyPress,
    onCellChange,
    onCellAccept,
    onCellReset,
    onCellSelect,
    onCellHover,

    handleMoveFocusToTargetCell,

    _setNavigationMode: setNavigationMode,
    _setEditMode: setEditMode,
  };

  return {
    methods,
    tableState,
  };
};
