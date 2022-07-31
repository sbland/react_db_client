/* Data table cell wrapper components

Datatable cell wrap - Wraps any cell with hover events and optional with override
Datatable data cell - Wraps data cells with a right click event and chooses the cell
  component based on the column type
Cell - Interface between react window and data table cell


<DataTable>
  <Grid>
    <Cell>
    <DataTableCellHoverWrap>
*/

import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import '../_dataTable.scss';
import { DataTableContext } from '../DataTableConfig/DataTableConfig';
import { RowStyleContext } from '../RowStyleContext';
import { DataTableCellHoverWrap, DataTableDataCell, EditColumnCell } from './CellWrappers';

const Cell = ({ columnIndex, rowIndex, style, data }) => {
  const {
    className,
    tableData,
    headingsData,
    handleValueAccept,
    handleValueChange,
    handleValueReset,
    handleDeleteRow,
    handleMoveFocusToTargetRow,
    handleEditPanelBtnClick,
    handleAddToSelection,
    handleRemoveFromSelection,
    rowSelectionState = [],
    currentFocusedRow,
    currentFocusedColumn,
    navigationMode,
    setNavigationMode,
    customFieldComponents,
    disabled, // TODO: Make this per cell
    invalidRowsMessages,
  } = data;
  const { allowRowDelete, allowRowEditPanel, allowSelection, hasBtnsColumn } =
    useContext(DataTableContext);
  // const [navigationMode, setNavigationMode] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const cellWrapNavBtnRef = useRef(null);
  const cellDataBtnRef = useRef(null);

  const isSelected = rowSelectionState[rowIndex];
  const isFocused = currentFocusedColumn === columnIndex && currentFocusedRow === rowIndex;

  // If we have an edit column then the column data is out of sync with the column index by 1
  const headingData = useMemo(
    () => headingsData[columnIndex - (hasBtnsColumn ? 1 : 0)] || {},
    [headingsData, columnIndex, hasBtnsColumn]
  );
  const rowData = useMemo(() => tableData[rowIndex] || {}, [tableData, rowIndex]);
  const rowStyles = useContext(RowStyleContext);
  const cellStyle = {
    ...style,
    ...(rowStyles && !hasBtnsColumn ? rowStyles[rowIndex] : {}),
  };

  const cellClassName = [className, isFocused && 'focusedCell'].filter((f) => f).join(' ');

  useEffect(() => {
    // If cell is focused set focus to navBtn
    if (
      !editMode &&
      navigationMode &&
      isFocused &&
      cellWrapNavBtnRef &&
      cellWrapNavBtnRef.current
    ) {
      cellWrapNavBtnRef.current.focus();
    }
  }, [cellWrapNavBtnRef, isFocused, editMode, navigationMode]);

  const handleCellUpdate = useCallback(
    (newValue) => handleValueChange(newValue, rowData.uid, rowIndex, headingData.uid),
    [handleValueChange, rowData.uid, rowIndex, headingData.uid]
  );

  const handleCellAccept = useCallback(
    (newValue) => {
      setNavigationMode(true);
      setEditMode(false);
      handleValueAccept(newValue, rowData.uid, rowIndex, headingData.uid);
      handleMoveFocusToTargetRow(rowIndex, columnIndex);
      cellWrapNavBtnRef.current.focus();
    },
    [
      handleValueAccept,
      handleMoveFocusToTargetRow,
      headingData.uid,
      rowData.uid,
      rowIndex,
      columnIndex,
      setNavigationMode,
    ]
  );
  useEffect(() => {
    if (!isFocused) {
      // handleCellAccept(rowData[headingData.uid]);
      // setEditMode(false);
      // setNavigationMode(true);
    }
  }, [handleCellAccept, isFocused, rowData, headingData, setNavigationMode]);

  const handleCellReset = useCallback(() => {
    setNavigationMode(true);
    setEditMode(false);
    handleMoveFocusToTargetRow(rowIndex, columnIndex);
    handleValueReset(rowData.uid, rowIndex, headingData.uid);
  }, [
    handleMoveFocusToTargetRow,
    columnIndex,
    rowData.uid,
    rowIndex,
    headingData.uid,
    handleValueReset,
    setNavigationMode,
  ]);

  const handleCellHoverMouse = () => {
    if (navigationMode) handleMoveFocusToTargetRow(rowIndex, columnIndex);
  };

  const handleSelectCell = useCallback(() => {
    const { readOnly } = headingData;
    if (!readOnly && navigationMode && !disabled) {
      setNavigationMode(false);
      setEditMode(true);
    } else if (!navigationMode) {
      /* Got stuck in nav false */
    }
    handleMoveFocusToTargetRow(rowIndex, columnIndex);
  }, [
    handleMoveFocusToTargetRow,
    rowIndex,
    columnIndex,
    headingData,
    setNavigationMode,
    navigationMode,
    disabled,
  ]);

  const classNames = [
    className,
    isFocused ? 'focused' : 'notFocused',
    `row_index_${rowIndex}`,
    `column_index_${columnIndex}`,
    `column_id_${headingData.uid}`,
  ].join(' ');

  const onCellWrapBtnKeyPress = useCallback(
    (e) => {
      if (navigationMode) {
        switch (e.key) {
          case 'ArrowRight':
            e.preventDefault();
            handleMoveFocusToTargetRow(rowIndex, columnIndex + 1);
            break;
          case 'ArrowLeft':
            e.preventDefault();
            handleMoveFocusToTargetRow(rowIndex, columnIndex - 1);
            break;
          case 'ArrowUp':
            e.preventDefault();
            handleMoveFocusToTargetRow(rowIndex - 1, columnIndex);
            break;
          case 'ArrowDown':
            e.preventDefault();
            handleMoveFocusToTargetRow(rowIndex + 1, columnIndex);
            break;
          case 'Enter':
            e.preventDefault();
            handleSelectCell();
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
            handleMoveFocusToTargetRow(rowIndex, columnIndex);
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
      handleMoveFocusToTargetRow,
      handleSelectCell,
      setNavigationMode,
    ]
  );

  const lhsTagStyle = {
    ...(rowStyles ? rowStyles[rowIndex] : {}),
    width: '8px',
    fontSize: '1rem',
    lineHeight: '1rem',
    color: 'white',
    borderRadius: '0.3rem',
    fontWeight: 800,
    textAlign: 'center',
    cursor: 'pointer',
  };

  const lhsTagClass = [
    'button-reset',
    invalidRowsMessages && invalidRowsMessages[rowIndex] ? 'popIn invalidRow' : '', // TODO: Move style to datatable css
  ].join(' ');

  const handleTagButtonClick = () => {
    const message = invalidRowsMessages && invalidRowsMessages[rowIndex];
    if (message) alert(message.text);
  };

  /* Render LHS button Column */
  if (hasBtnsColumn && columnIndex === 0)
    return (
      <DataTableCellHoverWrap
        className={cellClassName}
        style={cellStyle}
        // handleHover={handleCellHoverMouse}
      >
        <button
          type="button"
          className={lhsTagClass}
          style={lhsTagStyle}
          onClick={handleTagButtonClick}
        >
          !
        </button>
        <EditColumnCell
          allowSelection={allowSelection}
          allowRowDelete={allowRowDelete}
          allowRowEditPanel={allowRowEditPanel}
          isSelected={isSelected}
          rowIndex={rowIndex}
          handleRemoveFromSelection={handleRemoveFromSelection}
          handleAddToSelection={handleAddToSelection}
          handleDeleteRow={handleDeleteRow}
          handleEditPanelBtnClick={handleEditPanelBtnClick}
          rowUid={rowData.uid}
          style={cellStyle}
        />
      </DataTableCellHoverWrap>
    );

  /* Render Cell */

  return (
    <>
      {columnIndex === 0 && (
        <button
          type="button"
          className={lhsTagClass}
          style={lhsTagStyle}
          onClick={handleTagButtonClick}
        >
          !
        </button>
      )}
      <DataTableCellHoverWrap
        className={cellClassName}
        style={cellStyle}
        handleHover={handleCellHoverMouse}
        disabled={disabled}
      >
        <div
          ref={cellWrapNavBtnRef}
          type="button"
          data-testid={`cell_${columnIndex}_${rowIndex} cell_${headingData.uid}`}
          className={`${classNames} navigationButton cellWrapBtn button-reset`}
          onClick={() => handleSelectCell()}
          style={{ width: '100%' }}
          onKeyDown={(e) => {
            onCellWrapBtnKeyPress(e);
          }}
          role="presentation"
          tabIndex={`${columnIndex + rowIndex * 10}`}
        >
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
            updateData={(newVal) => handleCellUpdate(newVal)}
            acceptValue={(newVal) => handleCellAccept(newVal)}
            resetValue={() => handleCellReset()}
            cellDataBtnRef={cellDataBtnRef}
            customFieldComponents={customFieldComponents}
          />
        </div>
      </DataTableCellHoverWrap>
    </>
  );
};

Cell.propTypes = {
  columnIndex: PropTypes.number.isRequired,
  rowIndex: PropTypes.number.isRequired,
  style: PropTypes.shape({}).isRequired,
  data: PropTypes.shape({
    tableData: PropTypes.arrayOf(
      PropTypes.shape({
        uid: PropTypes.string.isRequired,
      })
    ).isRequired,
    headingsData: PropTypes.arrayOf(
      PropTypes.shape({
        uid: PropTypes.string.isRequired,
      })
    ).isRequired,
    handleValueAccept: PropTypes.func.isRequired,
    handleValueChange: PropTypes.func.isRequired,
    handleValueReset: PropTypes.func.isRequired,
    handleDeleteRow: PropTypes.func.isRequired,
    handleEditPanelBtnClick: PropTypes.func.isRequired,
    handleAddToSelection: PropTypes.func.isRequired,
    handleRemoveFromSelection: PropTypes.func.isRequired,
    handleMoveFocusToTargetRow: PropTypes.func.isRequired,
    className: PropTypes.string,
    hasEditColumn: PropTypes.bool,
    rowSelectionState: PropTypes.arrayOf(PropTypes.bool).isRequired,
    currentFocusedRow: PropTypes.number,
    currentFocusedColumn: PropTypes.number,

    navigationMode: PropTypes.bool.isRequired,
    setNavigationMode: PropTypes.func.isRequired,
    customFieldComponents: PropTypes.objectOf(PropTypes.elementType).isRequired,
    disabled: PropTypes.bool.isRequired,
    invalidRowsMessages: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
      })
    ),
  }).isRequired,
};

export default Cell;
