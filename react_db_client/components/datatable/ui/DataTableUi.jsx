/* A datatable that does not do any data management.
Should be used alongside the DataManager hook */

import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import AutoSizer from 'react-virtualized-auto-sizer';
import useScrollSync from 'react-scroll-sync-hook';
import styled from 'styled-components';
import { FixedSizeList } from 'react-window';
import { DataTableCellReadOnly } from '@samnbuk/react_db_client.components.datatable.cell-types';
import { scrollbarWidth } from '@samnbuk/react_db_client.helpers.html-helpers';
import { switchF } from '@samnbuk/react_db_client.helpers.func-tools';
import {
  ColumnWidthManager,
  useColumnManager,
} from '@samnbuk/react_db_client.components.column-manager';
import { CellNavigationCellWrap } from '@samnbuk/react_db_client.components.datatable.cell';
import {
  DataTableConfigConnector,
  DataTableContext,
} from '@samnbuk/react_db_client.components.datatable.config';

import { Cell } from '@samnbuk/react_db_client.components.datatable.cell';

import {
  DataTableHeadings,
  DataTableTotals,
} from '@samnbuk/react_db_client.components.datatable.components';

// import '@samnbuk/react_db_client.constants.style';
// import './style.scss';
// import './_dataTable_condensed.scss';

const DEFAULT_COLUMN_WIDTH = 120;
const MIN_TABLE_HEIGHT = 30;

const defaultComponent = () => (props) => <DataTableCellReadOnly {...props} />;
const Styles = styled.div`
  // padding: 1rem;
  width: 100%;
  height: 100%;
  position: relative;
  .table {
    height: 100%;

    .th,
    .td {
      margin: 0;
      padding: 0;
      position: relative;
      box-sizing: border-box;
      border-bottom: ${(props) => props.theme.cellBorder};
      border-right: ${(props) => props.theme.cellBorder};
      flex-shrink: 0;
      line-height: 1.3em;

      :last-child {
        border-right: ${(props) => props.theme.cellBorder};
        // margin-right: 12px; // TODO: should be scroll bar width
      }
    }
    .table_body {
      overflow: hidden;
    }
    .table_body_row {
      todo: should be scroll bar width;
      margin-right: -20px;
      overflow-x: hidden; // Must be set to stop any overflows causing scroll sync issues
    }

    .thrs {
      -ms-overflow-style: none; /* for Internet Explorer, Edge */
      scrollbar-width: none; /* for Firefox */
      overflow-y: scroll;
      overflow-x: hidden; // Must be set to stop any overflows causing scroll sync issues
    }

    .thrs::-webkit-scrollbar {
      display: none; /* for Chrome, Safari, and Opera */
    }

    .navigationButton,
    .dataTableCell_wrap,
    .dataTableCellData {
      width: 100%;
      height: 100%;
    }

    .navigationButton,
    .dataTableCell_wrap {
      position: absolute;
    }
  }
`;

function TableHeadings({ headerRef, columns, tableWidth, headerHeight, cellStyleOverrides }) {
  return (
    <div className="thrs" style={{ width: '100%', overflow: 'auto hidden' }} ref={headerRef}>
      <div
        style={{
          display: 'flex',
          width: tableWidth,
          position: 'relative',
          height: headerHeight,
        }}
        className="tr"
      >
        {columns.map((column, columnIndex) => (
          <div
            className="th"
            key={column.uid}
            style={{
              ...cellStyleOverrides(columnIndex),
            }}
          >
            {column.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function TableRowWrap(tableWidth, cellStyleOverrides, componentMap, columns, tableData) {
  const TableRow = ({ index, style, isScrolling }) => {
    return (
      <div
        className="tr table_body_row"
        style={{
          ...style,
          width: tableWidth,
          display: 'flex',
        }}
      >
        {columns.map((column, columnIndex) => {
          // const cellData = row[column.uid];
          // TODO: Simplify this
          // const { tableData } = tableState;
          if (isScrolling) {
            const headingData = useMemo(() => columns[columnIndex] || {}, [columns, columnIndex]);
            const rowData = useMemo(() => tableData[index] || {}, [tableData, index]);
            const { uid: headingId, type: cellType } = headingData;
            const cellData = rowData[headingId];

            // const CellComponent = useMemo(
            //   () => switchF(cellType, componentMap, defaultComponent),
            //   [cellType, componentMap, defaultComponent]
            // );
            return (
              <>
                {/* <CellNavigationCellWrap
                  cellWrapNavBtnRef={null}
                  classNames={null}
                  onClick={() => {}}
                  onKeyDown={() => {}}
                  columnIndex={columnIndex}
                  rowIndex={rowIndex}
                /> */}
                <div
                  // {...cell.getCellProps()}
                  className="td"
                  style={{
                    // ...cell.getCellProps().style,
                    display: 'inline-block',
                    // width:
                    boxSizing: 'border-box',
                    ...cellStyleOverrides(columnIndex),
                  }}
                >
                  {/* <CellComponent
                  // rowId={rowId}
                  // rowIndex={rowIndex}
                  // classNames={classNames}
                  // focused={!disabled && isFocused}
                  // editMode={!disabled && editMode}
                  columnId={headingId}
                  cellData={cellData}
                  rowData={rowData}
                  columnData={headingData}
                  // TODO: rename as onChange
                  updateData={() => {}}
                  acceptValue={() => {}}
                  resetValue={() => {}}
                  componentMap={componentMap}
                /> */}
                  {
                    isScrolling && (
                      <DataTableCellReadOnly cellData={cellData} columnData={columns} />
                    )
                    // 'SCROLLING'
                  }
                </div>
              </>
            );
          }

          return (
            <div
              className="td"
              style={{
                display: 'inline-block',
                boxSizing: 'border-box',
                ...cellStyleOverrides(columnIndex),
              }}
            >
              <Cell
                rowIndex={index}
                columnIndex={columnIndex}
                componentMap={componentMap}
                headingsData={columns}
              />
            </div>
          );
        })}
      </div>
    );
  };
  return TableRow;
}

const useScrollSyncWrap = ({ nodeRefs, options = {} }) => {
  const { registerPane, unregisterPane } = useScrollSync(options);

  useEffect(() => {
    nodeRefs.forEach((nodeRef) => {
      if (nodeRef?.current) {
        registerPane(nodeRef.current);
      }
    });
    return () =>
      nodeRefs.forEach((nodeRef) => {
        if (nodeRef?.current) {
          unregisterPane(nodeRef.current);
        }
      });
  }, [nodeRefs, registerPane, unregisterPane]);

  return {};
};

/** Data Table Component
 * Converts an array of objects to a table by mapping against a column schema(headingsData)
 *
 */
export const DataTableUi = ({
  headingsData,
  totalsData,
  methods,
  tableState,
  rowStyles, // per row style overrides
  currentSelectionIds,
  componentMap,
  disabled,
  invalidRowsMessages,
}) => {
  useEffect(() => {
    /* Check inputs */
    if (!componentMap) throw Error('Must supply component Map');
  }, [componentMap]);

  const columns = useMemo(
    () =>
      headingsData.map((c) => {
        return {
          ...c,
          accessor: c.accessor || c.uid,
          // accessor: (row, i) => row[c.uid]
        };
      }),
    [headingsData]
  );

  const { tableData } = tableState;

  const {
    minWidth,
    maxWidth,
    showTotals,
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

  const { columnWidths, setColumnWidths, tableWidth } = useColumnManager({
    headingsDataList: headingsData,
    allowRowDelete,
    allowRowEditPanel,
    allowEditRow,
    minWidth,
    maxWidth,
    btnColumnBtnCount: allowRowDelete + allowRowEditPanel + allowSelection,
  });

  /* Setup Scroll Sync */
  const headerRef = useRef(null);
  const bodyRef = useRef(null);
  const innerBodyRef = useRef(null);
  const columnManagerRef = useRef(null);

  const nodeRefs = useMemo(
    () => [headerRef, bodyRef, innerBodyRef, columnManagerRef],
    [headerRef, bodyRef, innerBodyRef, columnManagerRef]
  );

  useScrollSyncWrap({
    nodeRefs,
    options: {
      proportional: false,
    },
  });

  const scrollBarSize = React.useMemo(() => scrollbarWidth(), []);

  const resizedTableWidth = useMemo(
    () => columnWidths.reduce((acc, v) => acc + v, 0) + scrollBarSize * 0,
    [columnWidths, scrollBarSize]
  );

  const cellStyleOverrides = useCallback(
    (columnIndex) => ({
      marginRight: columnIndex === columns.length - 1 ? scrollBarSize : 0,
      width: columnWidths[columnIndex],
    }),
    [scrollBarSize, columnWidths, columns]
  );

  const RenderRow = React.useCallback(
    TableRowWrap(resizedTableWidth, cellStyleOverrides, componentMap, columns, tableData),
    [resizedTableWidth, cellStyleOverrides, componentMap, columns, tableData]
  );

  const rowCount = tableData.length;
  const rowHeight = 35;
  const headerHeight = 40;

  // TODO: Implement edit panel opening
  // eslint-disable-next-line no-unused-vars
  // const handleEditPanelBtnClick = useCallback((rowId, rowIndex) => {}, []);

  // const rowSelectionState = useMemo(
  //   () => tableData.map((row) => currentSelectionIds.indexOf(row.uid) !== -1),
  //   [currentSelectionIds, tableData]
  // );

  // TODO: CLEAN UP BELOW BLOCK
  // const outsideWrapClassName = [
  //   'dataTable_rowsOutsideWrap',
  //   limitHeight ? 'dataTable_rowsOutsideWrap-limitHeight' : '',
  // ].join(' ');

  // const outsideWrapStyleOverride = {
  // maxHeight: limitHeight || null,
  // };
  // const tableWidthMin = useMemo(
  //   () => Math.min(maxTableWidth, tableWidth + 20),
  //   [tableWidth, maxTableWidth]
  // );
  // ==========================
  return (
    <Styles>
      <div className="table" style={{ width: '100%', overflow: 'hidden' }}>
        {allowColumnResize && (
          <ColumnWidthManager
            setColumnWidths={setColumnWidths}
            columnWidths={columnWidths}
            innerRef={columnManagerRef}
            minWidth={minWidth}
            maxWidth={maxWidth}
          />
        )}
        {showHeadings && (
          <TableHeadings
            headerRef={headerRef}
            columns={columns}
            tableWidth={resizedTableWidth * 1.2}
            headerHeight={headerHeight}
            cellStyleOverrides={(columnIndex) => ({
              height: headerHeight,
              marginRight: columnIndex === columns.length - 1 ? scrollBarSize : 0,
              width: columnWidths[columnIndex],
            })}
          />
        )}

        <AutoSizer>
          {({ height, width }) => (
            <div
              className="table_body"
              style={{
                width: width,
                height: height - headerHeight,
              }}
            >
              <FixedSizeList
                height={height - headerHeight}
                itemCount={rowCount}
                itemSize={rowHeight}
                width="100%"
                outerRef={innerBodyRef}
                useIsScrolling
              >
                {RenderRow}
              </FixedSizeList>
            </div>
          )}
        </AutoSizer>

        {/* {showTotals && (
          <DataTableTotals
            headingsDataList={headingsData}
            columnWidths={columnWidths}
            totals={totalsData || []}
            tableWidth={tableWidth}
            componentMap={componentMap}
          />
        )} */}
      </div>
    </Styles>
  );
};
DataTableUi.propTypes = {
  headingsData: PropTypes.arrayOf(
    PropTypes.shape({
      // TODO: Add headings shape
    })
  ).isRequired,
  totalsData: PropTypes.objectOf(PropTypes.number),
  tableState: PropTypes.shape({
    tableData: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
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
