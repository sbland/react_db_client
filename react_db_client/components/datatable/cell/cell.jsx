import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
// import '../_dataTable.scss';
import { RowStyleContext } from '@samnbuk/react_db_client.components.datatable.logic';
import { DataTableCellHoverWrap, DataTableDataCell } from './cell-wrappers';
import { CellNavigationCellWrap } from './cell-navigation-cell-wrap';
import { CellInfoBtn } from './cell-info-btn';

export function Cell({
  columnIndex,
  rowIndex,
  style,
  className,
  headingsData,
  methods,
  componentMap,
  disabled, // TODO: Make this per cell
  tableState,
}) {
  /* Interaction Methods */
  const {
    handleValueAccept,
    handleValueChange,
    handleValueReset,
    setNavigationMode,
    handleMoveFocusToTargetCell,
    setEditMode,
  } = methods;

  const {
    tableData,
    currentFocusedRow,
    currentFocusedColumn,
    navigationMode,
    editMode,
    invalidRowsMessages,
  } = tableState;
  console.log(currentFocusedRow)

  /* Data table config */
  // TODO: Note we are removing buttons column system
  // const { allowRowDelete, allowRowEditPanel, allowSelection, hasBtnsColumn } =
  //   useContext(DataTableContext);

  /* Cell Refs */
  /* The nav btn holds the pointer if this cell is focused but not in edit mode */
  const cellWrapNavBtnRef = useRef(null);
  // TODO: cellDataBtnRef is not used anywhere
  // const cellDataBtnRef = useRef(null);;

  /* Row State */
  // TODO: Can remove this or should pass to cell component?
  // const rowIsSelected = rowSelectionState[rowIndex];

  /* Cell State */
  // const [editMode, setEditMode] = useState(false); // TODO: Move to datatable logic
  const isFocused = currentFocusedColumn === columnIndex && currentFocusedRow === rowIndex;
  /* Cell Data */
  const headingData = useMemo(() => headingsData[columnIndex] || {}, [headingsData, columnIndex]);
  const rowData = useMemo(() => tableData[rowIndex] || {}, [tableData, rowIndex]);

  /* Cell Style */
  const rowStyles = useContext(RowStyleContext);
  const cellStyle = {
    ...style,
    ...(rowStyles && rowStyles[rowIndex]),
  };

  const cellClassName = [className, isFocused && 'focusedCell'].filter((f) => f).join(' ');

  const classNames = [
    className,
    isFocused ? 'focused' : 'notFocused',
    `row_index_${rowIndex}`,
    `column_index_${columnIndex}`,
    `column_id_${headingData.uid}`,
  ].join(' ');

  /* Update cell Focus State */
  useEffect(() => {
    // If cell is focused set focus to navBtn
    const shouldFocus =
      !editMode && navigationMode && isFocused && cellWrapNavBtnRef && cellWrapNavBtnRef.current
        ? true
        : false;
    if (shouldFocus) {
      cellWrapNavBtnRef.current.focus();
    }
  }, [cellWrapNavBtnRef, isFocused, editMode, navigationMode]);

  /* Middleware - handle cell data change */
  /* Cell -onChange */
  const handleOnChange = useCallback(
    (newValue) => handleValueChange(newValue, rowData.uid, rowIndex, headingData.uid),
    [handleValueChange, rowData.uid, rowIndex, headingData.uid]
  );

  /* Cell onAccept */
  const handleOnAccept = useCallback(
    (newValue) => {
      setNavigationMode(true);
      setEditMode(false);
      handleValueAccept(newValue, rowData.uid, rowIndex, headingData.uid);
      handleMoveFocusToTargetCell(rowIndex, columnIndex);
      cellWrapNavBtnRef.current.focus();
    },
    [
      handleValueAccept,
      handleMoveFocusToTargetCell,
      headingData.uid,
      rowData.uid,
      rowIndex,
      columnIndex,
      setNavigationMode,
    ]
  );

  const handleOnReset = useCallback(() => {
    setNavigationMode(true);
    setEditMode(false);
    handleMoveFocusToTargetCell(rowIndex, columnIndex);
    handleValueReset(rowData.uid, rowIndex, headingData.uid);
  }, [
    handleMoveFocusToTargetCell,
    columnIndex,
    rowData.uid,
    rowIndex,
    headingData.uid,
    handleValueReset,
    setNavigationMode,
  ]);

  const handleOnHover = useCallback(() => {
    if (navigationMode) handleMoveFocusToTargetCell(rowIndex, columnIndex);
  }, [rowIndex, columnIndex]);

  const handleOnSelect = useCallback(() => {
    const { readOnly } = headingData;
    if (!readOnly && navigationMode && !disabled) {
      setNavigationMode(false);
      setEditMode(true);
    } else if (!navigationMode) {
      /* Got stuck in nav false */
    }
    handleMoveFocusToTargetCell(rowIndex, columnIndex);
  }, [
    handleMoveFocusToTargetCell,
    rowIndex,
    columnIndex,
    headingData,
    setNavigationMode,
    navigationMode,
    disabled,
  ]);

  const handleKeyPress = useCallback(
    (e) => {
      if (navigationMode) {
        switch (e.key) {
          case 'ArrowRight':
            e.preventDefault();
            handleMoveFocusToTargetCell(rowIndex, columnIndex + 1);
            break;
          case 'ArrowLeft':
            e.preventDefault();
            handleMoveFocusToTargetCell(rowIndex, columnIndex - 1);
            break;
          case 'ArrowUp':
            e.preventDefault();
            handleMoveFocusToTargetCell(rowIndex - 1, columnIndex);
            break;
          case 'ArrowDown':
            e.preventDefault();
            handleMoveFocusToTargetCell(rowIndex + 1, columnIndex);
            break;
          case 'Enter':
            e.preventDefault();
            handleOnSelect();
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
    [
      navigationMode,
      rowIndex,
      columnIndex,
      handleMoveFocusToTargetCell,
      handleOnSelect,
      setNavigationMode,
    ]
  );

  return (
    <DataTableCellHoverWrap
      className={cellClassName}
      style={cellStyle}
      handleHover={handleOnHover}
      disabled={disabled}
    >
      <CellNavigationCellWrap
        cellWrapNavBtnRef={cellWrapNavBtnRef}
        classNames={classNames}
        onClick={handleOnSelect}
        onKeyDown={handleKeyPress}
        columnIndex={columnIndex}
        rowIndex={rowIndex}
      >
        <CellInfoBtn
          styles={rowStyles ? rowStyles[rowIndex] : {}}
          message={invalidRowsMessages && invalidRowsMessages[rowIndex]}
        />
        <DataTableDataCell
          isDisabled={disabled}
          rowId={rowData.uid}
          rowIndex={rowIndex}
          classNames={classNames}
          focused={!disabled && isFocused}
          editMode={!disabled && editMode}
          columnId={headingData.uid}
          cellData={rowData[headingData.uid]}
          rowData={rowData}
          columnData={headingData}
          // TODO: rename as onChange
          updateData={(newVal) => handleOnChange(newVal)}
          acceptValue={(newVal) => handleOnAccept(newVal)}
          resetValue={() => handleOnReset()}
          componentMap={componentMap}
        />
      </CellNavigationCellWrap>
    </DataTableCellHoverWrap>
  );
}

Cell.propTypes = {
  columnIndex: PropTypes.number.isRequired,
  rowIndex: PropTypes.number.isRequired,
  style: PropTypes.shape({}).isRequired,
  headingsData: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
    })
  ).isRequired,
  tableState: PropTypes.shape({
    tableData: PropTypes.arrayOf(
      PropTypes.shape({
        uid: PropTypes.string.isRequired,
      })
    ).isRequired,
    currentFocusedRow: PropTypes.number,
    currentFocusedColumn: PropTypes.number,
    navigationMode: PropTypes.bool.isRequired,
    editMode: PropTypes.bool.isRequired,
    invalidRowsMessages: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
      })
    ),
  }).isRequired,
  methods: PropTypes.shape({
    handleValueAccept: PropTypes.func.isRequired,
    handleValueChange: PropTypes.func.isRequired,
    handleValueReset: PropTypes.func.isRequired,
    // handleDeleteRow: PropTypes.func.isRequired,
    // handleEditPanelBtnClick: PropTypes.func.isRequired,
    // handleAddToSelection: PropTypes.func.isRequired,
    // handleRemoveFromSelection: PropTypes.func.isRequired,
    handleMoveFocusToTargetCell: PropTypes.func.isRequired,
    setNavigationMode: PropTypes.func.isRequired,
  }).isRequired,
  className: PropTypes.string,
  // hasEditColumn: PropTypes.bool,
  // rowSelectionState: PropTypes.arrayOf(PropTypes.bool).isRequired,
  componentMap: PropTypes.objectOf(PropTypes.elementType).isRequired,
  disabled: PropTypes.bool,
};

Cell.defaultProps = {
  disabled: false,
};
