/* A datatable that does not do any data management.
Should be used alongside the DataManager hook */

import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { VariableSizeGrid as Grid } from 'react-window';
import { EFilterType, Uid } from '@react_db_client/constants.client-types';

import DataTableHeadings from './DataTableHeadings';
import DataTableConfigConnector, { DataTableContext } from './DataTableConfig/DataTableConfig';
import DataTableTotals from './DataTableTotals';

import Cell from './DataTableCell/DataTableCell';
import DataTableColumnWidthManager from './TableColumnManager/DataTableColumnWidthManager';
import useColumnWidthManager from './TableColumnManager/ColumnManager';

import './_dataTable.scss';
import './_dataTable_condensed.scss';
import { RowStyleContext } from './RowStyleContext';
import { IRow, THeading } from './lib';

const MIN_TABLE_HEIGHT = 30;
const getRowHeight = () => 22;

export interface IDataTableUiProps {
  headingsData;
  tableData: IRow[];
  totalsData: { [x: Uid]: number } | null;
  updateSortBy;
  addFilter;
  updateValue;
  acceptValue;
  resetValue;
  deleteRow;
  rowStyles; // per row style overrides
  handleHideColumn;
  maxTableHeight?: number;
  maxTableWidth?: number;
  currentSelectionIds;
  addToSelection;
  removeFromSelection;
  handleAddRow;
  customFieldComponents;
  disabled;
  invalidRowsMessages;
}

/** Data Table Component
 * Converts an array of objects to a table by mapping against a column schema(headingsData)
 *
 */
export const DataTableUi: React.FC<IDataTableUiProps> = ({
  headingsData,
  tableData,
  totalsData,
  updateSortBy,
  addFilter,
  updateValue,
  acceptValue,
  resetValue,
  deleteRow,
  rowStyles, // per row style overrides
  // Could pass menu component instead
  handleHideColumn,
  maxTableHeight = 99999,
  maxTableWidth,
  currentSelectionIds,
  addToSelection,
  removeFromSelection,
  handleAddRow,
  customFieldComponents,
  disabled,
  invalidRowsMessages,
}) => {
  const {
    minWidth,
    maxWidth,
    showTotals,
    limitHeight,
    hasBtnsColumn,
    allowAddRow,
    showHeadings,
    allowColumnResize,
    allowCellFocus,
    debugMode,
  } = useContext(DataTableContext);
  const gridRef = useRef<any>(null);

  const rowCount = tableData.length;
  const [navigationMode, setNavigationMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tableIsFocused, setTableIsFocused] = useState(false);

  const fullHeadingsList: THeading[] = useMemo(() => {
    return hasBtnsColumn
      ? [
          {
            uid: 'buttonColumn',
            label: '',
            columnWidth: 5,
            type: EFilterType.button,
          },
        ].concat(headingsData)
      : headingsData;
  }, [headingsData, hasBtnsColumn]);

  const { columnWidths, setColumnWidths, tableWidth } = useColumnWidthManager({
    headingsDataList: fullHeadingsList,
    minWidth,
    maxWidth,
  });
  const columnCount = columnWidths.length;

  const tableHeight = React.useMemo(
    () => Math.max(MIN_TABLE_HEIGHT, Math.min(rowCount * 22 + 22, maxTableHeight)),
    [rowCount, maxTableHeight]
  );
  const [currentFocusedColumn, setCurrentFocusedColumn] = useState(
    // eslint-disable-next-line no-nested-ternary
    allowCellFocus ? (hasBtnsColumn ? 1 : 0) : -1
  );

  const getColumnWidth = React.useCallback(
    (index) => {
      return columnWidths[index];
    },
    [columnWidths]
  );
  const [currentFocusedRow, setCurrentFocusedRow] = useState(0);

  const handleMouseEnterTable = useCallback(() => {
    if (!tableIsFocused) {
      setTableIsFocused(true);
      setNavigationMode(true);
    }
  }, [tableIsFocused]);

  useEffect(() => {
    if (gridRef && gridRef.current) {
      gridRef.current.resetAfterColumnIndex(0, true);
    }
  }, [gridRef, columnWidths, tableWidth]);

  const handleValueChange = useCallback(
    (newVal, rowId, rowIndex, colId) => {
      updateValue(newVal, rowId, rowIndex, colId);
    },
    [updateValue]
  );

  const handleValueAccept = useCallback(
    (newVal, rowId, rowIndex, colId) => {
      acceptValue(newVal, rowId, rowIndex, colId);
    },
    [acceptValue]
  );

  const handleValueReset = useCallback(
    (rowId, rowIndex, colId) => {
      resetValue(rowId, rowIndex, colId);
    },
    [resetValue]
  );

  const handleDeleteRow = useCallback(
    (rowId, rowIndex) => {
      deleteRow(rowId, rowIndex);
    },
    [deleteRow]
  );

  const handleAddToSelection = useCallback(
    (rowId, rowIndex) => {
      addToSelection(rowId, rowIndex);
    },
    [addToSelection]
  );
  const handleRemoveFromSelection = useCallback(
    (rowId, rowIndex) => {
      removeFromSelection(rowId, rowIndex);
    },
    [removeFromSelection]
  );

  const handleUpdateSortBy = (newSortByHeadingId) => {
    updateSortBy(newSortByHeadingId);
  };

  const handleMoveFocusToTargetRow = useCallback(
    (rowIndex, columnIndex) => {
      if (!allowCellFocus) return;
      const moveToNextRow =
        rowIndex < rowCount - 1 && columnIndex >= (hasBtnsColumn ? columnCount + 1 : columnCount);
      const moveToPrevRow = rowIndex > 0 && columnIndex === (hasBtnsColumn ? 0 : -1);
      const addNewRow = rowIndex === rowCount && allowAddRow;
      const doNothing =
        (rowIndex === 0 && columnIndex === (hasBtnsColumn ? 0 : -1)) ||
        (rowIndex === rowCount - 1 &&
          columnIndex >= (hasBtnsColumn ? columnCount + 1 : columnCount));
      if (moveToNextRow) {
        setCurrentFocusedColumn(hasBtnsColumn ? 1 : 0);
        setCurrentFocusedRow(rowIndex + 1);
      } else if (moveToPrevRow) {
        setCurrentFocusedColumn(hasBtnsColumn ? columnCount : columnCount - 1);
        setCurrentFocusedRow(rowIndex - 1);
      } else if (addNewRow) {
        setCurrentFocusedColumn(hasBtnsColumn ? 1 : 0);
        setCurrentFocusedRow(rowIndex);
        handleAddRow();
      } else if (doNothing) {
        // setCurrentFocusedColumn(columnIndex);
        // setCurrentFocusedRow(rowIndex);
      } else {
        setCurrentFocusedColumn(columnIndex);
        setCurrentFocusedRow(rowIndex);
      }
    },
    [rowCount, columnCount, hasBtnsColumn, allowAddRow, handleAddRow, allowCellFocus]
  );

  // TODO: Implement edit panel opening
  // eslint-disable-next-line no-unused-vars
  const handleEditPanelBtnClick = useCallback((rowId, rowIndex) => {}, []);

  const rowSelectionState = useMemo(
    () => tableData.map((row) => currentSelectionIds.indexOf(row.uid) !== -1),
    [currentSelectionIds, tableData]
  );

  const getCellData = useMemo(
    () => ({
      tableData,
      headingsData,
      handleValueChange,
      handleValueAccept,
      handleValueReset,
      handleDeleteRow,
      handleMoveFocusToTargetRow,
      handleEditPanelBtnClick,
      handleAddToSelection,
      handleRemoveFromSelection,
      rowSelectionState,
      currentFocusedColumn,
      currentFocusedRow,
      navigationMode,
      setNavigationMode,
      editMode,
      setEditMode,
      customFieldComponents,
      disabled,
      invalidRowsMessages,
    }),
    [
      tableData,
      headingsData,
      handleValueChange,
      handleValueAccept,
      handleValueReset,
      handleDeleteRow,
      handleMoveFocusToTargetRow,
      handleEditPanelBtnClick,
      handleAddToSelection,
      handleRemoveFromSelection,
      rowSelectionState,
      currentFocusedColumn,
      currentFocusedRow,
      navigationMode,
      setNavigationMode,
      editMode,
      setEditMode,
      customFieldComponents,
      disabled,
      invalidRowsMessages,
    ]
  );

  const outsideWrapClassName = [
    'dataTable_rowsOutsideWrap',
    limitHeight ? 'dataTable_rowsOutsideWrap-limitHeight' : '',
  ].join(' ');

  const outsideWrapStyleOverride = {
    maxHeight: limitHeight || undefined,
  };
  // const tableWidthMin = useMemo(
  //   () => Math.min(maxTableWidth, tableWidth + 20),
  //   [tableWidth, maxTableWidth]
  // );
  // ==========================

  return (
    <div
      className="dataTable"
      data-testid="dataTable"
      style={{
        maxWidth: `${tableWidth}px`,
      }}
      onMouseOver={handleMouseEnterTable}
      onMouseLeave={() => setTableIsFocused(false)}
    >
      {allowColumnResize && (
        <DataTableColumnWidthManager
          setColumnWidths={setColumnWidths}
          columnWidths={columnWidths}
          minWidth={minWidth}
          maxWidth={maxWidth}
          tableWidth={tableWidth}
        />
      )}
      {showHeadings && (
        <DataTableHeadings
          headingsDataList={fullHeadingsList}
          setSortBy={handleUpdateSortBy}
          handleAddFilter={addFilter}
          columnWidths={columnWidths}
          handleHideColumn={handleHideColumn}
          tableWidth={tableWidth}
        />
      )}
      <div className={outsideWrapClassName} style={outsideWrapStyleOverride}>
        {/* The row style context provider allow us to access additional props inside cell */}
        <RowStyleContext.Provider value={rowStyles}>
          <Grid
            ref={gridRef}
            className="Grid"
            columnCount={columnCount}
            columnWidth={getColumnWidth}
            height={tableHeight}
            rowCount={rowCount}
            rowHeight={getRowHeight}
            width={tableWidth}
            itemData={getCellData}
          >
            {Cell}
          </Grid>
        </RowStyleContext.Provider>
      </div>
      {/* TODO: Do we need to have a add new row component? */}
      {/* {addingNewRow && (
        <DataTableNewRow
          headingsDataList={visableColumns}
          setaddingNewRow={setaddingNewRow}
          handleAddNewRow={addNewRow}
          uidList={Object.keys(rawData || {})}
          columnWidths={columnWidths}
          tableWidth={tableWidth}
        />
      )} */}
      {showTotals && (
        <DataTableTotals
          headingsDataList={fullHeadingsList}
          columnWidths={columnWidths}
          totals={totalsData || []}
          tableWidth={tableWidth}
          customFieldComponents={customFieldComponents}
        />
      )}
      {debugMode && (
        <div className="dataTable_debug">
          <div>Table width: {tableWidth}</div>
          <div>Column widths: {JSON.stringify(columnWidths)}</div>
          {/* Show focus state */}
          <div>Current focused column: {currentFocusedColumn}</div>
          <div>Current focused row: {currentFocusedRow}</div>
          {/* Show selection state */}
          <div>Current selection: {JSON.stringify(currentSelectionIds)}</div>
          {/* Show navigationMode state */}
          <div>Navigation mode: {navigationMode ? 'ON' : 'OFF'}</div>
          {/* Show tableIsFocused state */}
          <div>Table is focused: {tableIsFocused ? 'ON' : 'OFF'}</div>
          {/* Show editMode state */}
          <div>Edit mode: {editMode ? 'ON' : 'OFF'}</div>
        </div>
      )}
    </div>
  );
};

DataTableUi.propTypes = {
  headingsData: PropTypes.arrayOf(
    PropTypes.shape({
      // TODO: Add headings shape
    })
  ).isRequired,
  tableData: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalsData: PropTypes.objectOf(PropTypes.number),
  updateSortBy: PropTypes.func,
  addFilter: PropTypes.func,
  updateValue: PropTypes.func,
  acceptValue: PropTypes.func,
  resetValue: PropTypes.func,
  deleteRow: PropTypes.func,
  handleHideColumn: PropTypes.func,
  rowStyles: PropTypes.arrayOf(PropTypes.shape({})),
  maxTableHeight: PropTypes.number,
  maxTableWidth: PropTypes.number,
  currentSelectionIds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
    .isRequired,
  addToSelection: PropTypes.func,
  removeFromSelection: PropTypes.func,
  handleAddRow: PropTypes.func,
  customFieldComponents: PropTypes.objectOf(PropTypes.elementType),
  disabled: PropTypes.bool,
  invalidRowsMessages: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
    })
  ),
};

DataTableUi.defaultProps = {
  totalsData: {},
  updateSortBy: () => {
    throw new Error('Must implement updateSortBy');
  },
  addFilter: () => {
    throw new Error('addFilter not supplied');
  },
  updateValue: () => {
    throw new Error('updateValue not supplied');
  },
  acceptValue: () => {
    throw new Error('acceptValue not supplied');
  },
  resetValue: () => {
    throw new Error('resetValue not supplied');
  },
  deleteRow: () => {
    throw new Error('deleteRow not supplied');
  },
  handleHideColumn: () => {
    throw new Error('handleHideColumn not supplied');
  },
  addToSelection: () => {
    throw new Error('addToSelection not supplied ');
  },
  removeFromSelection: () => {
    throw new Error('removeFromSelection not supplied ');
  },
  handleAddRow: () => {
    throw new Error('handleAddRow not supplied ');
  },
  rowStyles: null,
  maxTableHeight: 2000,
  maxTableWidth: 2000,
  customFieldComponents: {},
  disabled: false,
  invalidRowsMessages: [],
};

export const DataTableUiWithConfig = DataTableConfigConnector({})(DataTableUi);
export default DataTableUi;
