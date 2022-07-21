import React from 'react';
import { generateNewRowData } from '@samnbuk/react_db_client.components.datatable.logic';

export const useHandleTableState = ({ columns, initialData }) => {
  const [editMode, setEditMode] = React.useState(false);
  const [navigationMode, setNavigationMode] = React.useState(true);
  const [currentFocusedColumn, setCurrentFocusedColumn] = React.useState(0);
  const [currentFocusedRow, setCurrentFocusedRow] = React.useState(0);
  const [tableData, setTableData] = React.useState(initialData);
  const [rowCount, setRowCount] = React.useState(tableData.length);
  const [cellResetToValue, setCellResetToValue] = React.useState(null);

  React.useEffect(() => {
    /* Update data if external data updates */
    setTableData(initialData);
  }, [initialData]);

  const onCellSelect = React.useCallback((e, rowIndex, columnIndex) => {
    setCurrentFocusedRow(rowIndex);
    setCurrentFocusedColumn(columnIndex);

    /* Timeout fixes issue with active cell location on click */
    setTimeout(() => {
      setNavigationMode(false);
      setEditMode(true);
    }, 100);
  }, []);

  const handleMoveFocusToTargetCell = React.useCallback((i, j) => {
    setCurrentFocusedColumn(j);
    setCurrentFocusedRow(i);
  }, []);

  const addNewRow = React.useCallback(() => {
    const newRowData = generateNewRowData(columns);
    setTableData((prev) => [...prev, newRowData]);
    setRowCount((prev) => prev + 1);
    // handleMoveFocusToTargetCell(rowIndex, columnIndex);
  }, [columns]);

  const onCellKeyPress = React.useCallback(
    (e, rowIndex, columnIndex) => {
      const atEndOfRow = columnIndex === columns.length - 1;
      const atStartOfRow = columnIndex === 0;
      const atTopRow = rowIndex === 0;
      const atBottomRow = rowIndex === rowCount - 1;
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
            else {
              handleMoveFocusToTargetCell(rowIndex, columnIndex);
              addNewRow();
            }
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
    },
    [columns, handleMoveFocusToTargetCell, onCellSelect, rowCount, addNewRow, navigationMode]
  );

  const setCellValue = React.useCallback((value, rowIndex, columnId) => {
    setTableData((prev) => {
      // TODO: Handle eval cell type
      // const heading = headings.find((h) => h.uid === colId);
      // if (heading.evaluateType) {
      //   // if the heading type is an evaluate heading we need to process
      //   // the reverse evaluation
      //   const prevRowData = prev.find((row) => row.uid === rowId);
      //   const newRowData = handleUpdateEvalField(heading, prevRowData, colId, newVal);
      //   const dataMod = Object.assign([], prev, { [rowIndex]: newRowData });
      //   return dataMod;
      // }
      const newRowData = { ...prev[rowIndex], [columnId]: value };
      const dataMod = Object.assign([], prev, { [rowIndex]: newRowData });
      return dataMod;
    });
  }, []);

  const onCellChange = React.useCallback(
    (value, rowIndex, columnIndex, columnId) => {
      setCellValue(value, rowIndex, columnId);
      if (cellResetToValue === null) {
        // TODO: can we do this without accessing the table data.
        const prevValue = tableData[rowIndex][columnId];
        setCellResetToValue(prevValue);
      }
    },
    [cellResetToValue, tableData, setCellValue]
  );

  const onCellAccept = React.useCallback(
    (newValue, rowIndex, columnIndex, columnId) => {
      setCellValue(newValue, rowIndex, columnId);
      setNavigationMode(true);
      setEditMode(false);
      setCellResetToValue(null);
      // TODO: handle external accept value
      // handleValueAccept(newValue, rowData.uid, rowIndex, headingData.uid);
      handleMoveFocusToTargetCell(rowIndex, columnIndex);
    },
    [handleMoveFocusToTargetCell, setCellValue]
  );

  const onCellReset = React.useCallback(
    (e, rowIndex, columnIndex, columnId) => {
      setNavigationMode(true);
      setEditMode(false);
      setCellValue(cellResetToValue, rowIndex, columnId);
      setCellResetToValue(null);
    },
    [cellResetToValue, setCellValue]
  );

  const onCellHover = React.useCallback(
    (e, rowIndex, columnIndex) => {
      if (navigationMode) {
        setCurrentFocusedRow(rowIndex);
        setCurrentFocusedColumn(columnIndex);
      }
    },
    [navigationMode]
  );

  return {
    rowCount,
    tableData,
    editMode,
    navigationMode,
    currentFocusedColumn,
    currentFocusedRow,

    _setRowCount: setRowCount,
    _setTableData: setTableData,
    _setEditMode: setEditMode,
    _setNavigationMode: setNavigationMode,
    _setCurrentFocusedColumn: setCurrentFocusedColumn,
    _setCurrentFocusedRow: setCurrentFocusedRow,

    /* Methods */
    onCellKeyPress,
    onCellChange,
    onCellAccept,
    onCellReset,
    onCellSelect,
    onCellHover,
    addNewRow,
    handleMoveFocusToTargetCell,
  };
};
