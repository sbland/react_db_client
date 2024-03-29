/* A datatable that does not do any data management.
Should be used alongside the DataManager hook */

import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { VariableSizeGrid as Grid } from 'react-window';

import {
  DataTableConfigConnector,
  DataTableContext,
  RowStyleContext,
} from '@react_db_client/components.datatable.logic';

import {
  Cell,
  DataTableHeadings,
  DataTableTotals,
} from '@react_db_client/components.datatable.components';
import {
  ColumnWidthManager,
  useColumnManager,
} from '@react_db_client/components.column-manager';

import '@react_db_client/constants.style';
import './style.scss';
// import './_dataTable_condensed.scss';

const MIN_TABLE_HEIGHT = 30;
/** Data Table Component
 * Converts an array of objects to a table by mapping against a column schema(headingsData)
 *
 */
export const DataTableUi = ({
  headingsData,
  tableData,
  totalsData,
  methods,
  rowStyles, // per row style overrides
  // Could pass menu component instead
  handleHideColumn,
  maxTableHeight,
  maxTableWidth,
  currentSelectionIds,
  componentMap,
  disabled,
  invalidRowsMessages,
}) => {
  if (!componentMap) throw Error('Must supply component Map');

  const {
    updateSortBy,
    addFilter,
    updateValue,
    acceptValue,
    resetValue,
    deleteRow,
    addToSelection,
    removeFromSelection,
    handleAddRow,
  } = methods;

  const {
    minWidth,
    maxWidth,
    showTotals,
    limitHeight,
    allowEditRow,
    allowRowDelete,
    allowRowEditPanel,
    hasBtnsColumn,
    allowSelection,
    allowAddRow,
    showHeadings,
    allowColumnResize,
    allowCellFocus,
  } = useContext(DataTableContext);
  const gridRef = useRef(null);

  const columnCount = headingsData.length;
  const rowCount = tableData.length;
  const [navigationMode, setNavigationMode] = useState(true);

  const { columnWidths, setColumnWidths, tableWidth } = useColumnManager({
    headingsDataList: headingsData,
    allowRowDelete,
    allowRowEditPanel,
    allowEditRow,
    minWidth,
    maxWidth,
    btnColumnBtnCount: allowRowDelete + allowRowEditPanel + allowSelection,
  });
  const [currentFocusedColumn, setCurrentFocusedColumn] = useState(
    // eslint-disable-next-line no-nested-ternary
    allowCellFocus ? (hasBtnsColumn ? 1 : 0) : -1
  );
  const [currentFocusedRow, setCurrentFocusedRow] = useState(0);

  /* Trigger grid size update when we resize column or table width */
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

  const handleMoveFocusToTargetCell = useCallback(
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

  // Props to pass to Cell
  const getCellData = useMemo(
    () => ({
      tableData,
      headingsData,
      methods: {
        handleValueChange,
        handleValueAccept,
        handleValueReset,
        handleDeleteRow,
        handleMoveFocusToTargetCell,
        handleEditPanelBtnClick,
        handleAddToSelection,
        handleRemoveFromSelection,
      },
      rowSelectionState,
      currentFocusedColumn,
      currentFocusedRow,
      navigationMode,
      setNavigationMode,
      componentMap,
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
      handleMoveFocusToTargetCell,
      handleEditPanelBtnClick,
      handleAddToSelection,
      handleRemoveFromSelection,
      rowSelectionState,
      currentFocusedColumn,
      currentFocusedRow,
      navigationMode,
      setNavigationMode,
      componentMap,
      disabled,
      invalidRowsMessages,
    ]
  );

  // TODO: CLEAN UP BELOW BLOCK
  const outsideWrapClassName = [
    'dataTable_rowsOutsideWrap',
    limitHeight ? 'dataTable_rowsOutsideWrap-limitHeight' : '',
  ].join(' ');

  const outsideWrapStyleOverride = {
    maxHeight: limitHeight || null,
  };
  const tableWidthMin = useMemo(
    () => Math.min(maxTableWidth, tableWidth + 20),
    [tableWidth, maxTableWidth]
  );
  // ==========================
  return (
    <div
      className="dataTable"
      style={
        {
          // width: `${tableWidth}px`,
        }
      }
    >
      {allowColumnResize && (
        <ColumnWidthManager
          setColumnWidths={setColumnWidths}
          columnWidths={columnWidths}
          minWidth={minWidth}
          maxWidth={maxWidth}
        />
      )}
      {/* {showHeadings && (
        <DataTableHeadings
          headingsDataList={headingsData}
          setSortBy={handleUpdateSortBy}
          handleAddFilter={addFilter}
          columnWidths={columnWidths}
          handleHideColumn={handleHideColumn}
          tableWidth={tableWidth}
        />
      )} */}
      <div className={outsideWrapClassName} style={outsideWrapStyleOverride}>
        {/* The row style context provider allow us to access additional props inside cell */}
        <RowStyleContext.Provider value={rowStyles}>
          <Grid
            ref={gridRef}
            className="Grid"
            columnCount={columnCount + (hasBtnsColumn ? 1 : 0)}
            columnWidth={(index) => columnWidths[index]}
            height={Math.max(
              MIN_TABLE_HEIGHT,
              Math.min(tableData.length * 22 + 22, maxTableHeight)
            )}
            rowCount={rowCount}
            rowHeight={() => 22}
            width={tableWidthMin}
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
        <div></div>
        // <DataTableTotals
        //   headingsDataList={headingsData}
        //   columnWidths={columnWidths}
        //   totals={totalsData || []}
        //   tableWidth={tableWidth}
        //   componentMap={componentMap}
        // />
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
  methods: PropTypes.shape({
    updateSortBy: PropTypes.func,
    addFilter: PropTypes.func,
    updateValue: PropTypes.func,
    acceptValue: PropTypes.func,
    resetValue: PropTypes.func,
    deleteRow: PropTypes.func,
    handleHideColumn: PropTypes.func,
    addToSelection: PropTypes.func,
    removeFromSelection: PropTypes.func,
    handleAddRow: PropTypes.func,
  }).isRequired,
  rowStyles: PropTypes.arrayOf(PropTypes.shape({})),
  maxTableHeight: PropTypes.number,
  maxTableWidth: PropTypes.number,
  currentSelectionIds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
    .isRequired,
  componentMap: PropTypes.objectOf(PropTypes.elementType).isRequired,
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
  disabled: false,
  invalidRowsMessages: [],
};

export const DataTableUiWithConfig = DataTableConfigConnector({})(DataTableUi);
export default DataTableUi;
