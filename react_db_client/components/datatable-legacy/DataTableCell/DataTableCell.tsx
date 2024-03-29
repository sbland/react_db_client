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
import { DataTableContext } from '../DataTableConfig/DataTableConfig';
import { RowStyleContext } from '../RowStyleContext';
import { DataTableCellHoverWrap, DataTableDataCell, EditColumnCell } from './CellWrappers';
import '../_dataTable.scss';
import { ICellData, IHeading, IRow } from '../lib';

export interface ICellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: ICellData;
}

export const Cell = ({ columnIndex, rowIndex, style, data }: ICellProps) => {
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
    editMode,
    setEditMode,
    customFieldComponents,
    disabled, // TODO: Make this per cell
    invalidRowsMessages,
  } = data;
  const { allowRowDelete, allowRowEditPanel, allowSelection, hasBtnsColumn } =
    useContext(DataTableContext);
  const [keyPressInProgress, setKeyPressInProgress] = useState(false);

  const cellWrapNavBtnRef = useRef<HTMLDivElement | null>(null);
  const cellDataBtnRef = useRef<HTMLButtonElement | null>(null);

  const isSelected = rowSelectionState[rowIndex];
  const isFocused = currentFocusedColumn === columnIndex && currentFocusedRow === rowIndex;

  // If we have an edit column then the column data is out of sync with the column index by 1
  const headingData = useMemo(
    () => headingsData[columnIndex - (hasBtnsColumn ? 1 : 0)] || ({} as IHeading),
    [headingsData, columnIndex, hasBtnsColumn]
  );
  const rowData: IRow = useMemo(() => tableData[rowIndex] || ({} as IRow), [tableData, rowIndex]);
  const rowStyles = useContext(RowStyleContext);
  const cellStyle: React.CSSProperties = {
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
      if (keyPressInProgress) return;
      setEditMode(false);
      setNavigationMode(true);
      handleValueAccept(newValue, rowData.uid, rowIndex, headingData.uid);
      handleMoveFocusToTargetRow(rowIndex, columnIndex);
      cellWrapNavBtnRef.current?.focus();
    },
    [
      keyPressInProgress,
      handleValueAccept,
      handleMoveFocusToTargetRow,
      headingData.uid,
      rowData.uid,
      rowIndex,
      columnIndex,
      setNavigationMode,
    ]
  );

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
    if (navigationMode && !editMode) handleMoveFocusToTargetRow(rowIndex, columnIndex);
  };

  const handleSelectCell = useCallback(() => {
    const { readOnly } = headingData;
    setNavigationMode(false);
    if (!readOnly && navigationMode && !editMode && !disabled) {
      setEditMode(true);
    } else {
      setNavigationMode(true);
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
    editMode,
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
      if (navigationMode && !editMode) {
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

  const lhsTagStyle: React.CSSProperties = {
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

  if (isNaN(cellStyle.left as number)) {
    console.info(cellStyle);
    console.info(columnIndex, rowIndex, rowData, headingData);
  }

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
          data-testid={`rowStatusBtn_${rowIndex}`}
          onClick={handleTagButtonClick}
        >
          {invalidRowsMessages && invalidRowsMessages[rowIndex] ? '!' : ''}
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
          data-testid={`cell_${columnIndex}_${rowIndex}_ cell_${headingData.uid}_`}
          data-editmode={editMode ? 'true' : 'false'}
          data-columnid={headingData.uid}
          data-rowid={rowData.uid}
          data-columnindex={columnIndex}
          data-rowindex={rowIndex}
          className={`${classNames} navigationButton cellWrapBtn button-reset`}
          onClick={handleSelectCell}
          style={{ width: '100%' }}
          onKeyDown={(e) => {
            onCellWrapBtnKeyPress(e);
            setKeyPressInProgress(true);
          }}
          onKeyUp={() => setKeyPressInProgress(false)}
          role="presentation"
          tabIndex={columnIndex + rowIndex * 10}
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
            updateData={handleCellUpdate}
            acceptValue={handleCellAccept}
            resetValue={handleCellReset}
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
