/* A datatable that does not do any data management.
Should be used alongside the DataManager hook */

// TODO: https://reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often

import React, { useContext, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useScrollSyncWrap } from 'react-scroll-sync-hook';
import styled from 'styled-components';
import { FixedSizeList } from 'react-window';
import { DataTableCellReadOnly } from '@samnbuk/react_db_client.components.datatable.cell-types';
import { ColumnWidthManager, useColumnManager } from '@react_db_client/components.column-manager';
import {
  DataTableConfigConnector,
  DataTableContext,
} from '@samnbuk/react_db_client.components.datatable.config';
import { TableStateContext } from '@samnbuk/react_db_client.components.datatable.state';
import { Cell, CellSimple } from '@samnbuk/react_db_client.components.datatable.cell';

// TODO: Bring in old headings functionality
import {
  DataTableHeadings,
  DataTableTotals,
} from '@samnbuk/react_db_client.components.datatable.components';

const defaultComponent = () => (props) => <DataTableCellReadOnly {...props} />;
export const Styles = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  .table_wrap {
    height: 100%;

    .table_body {
      overflow: hidden;
    }

    /* Cells */
    .th,
    .td {
      display: inline-block;
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
    .table_body_row,
    .tr {
      margin-right: -20px;
      overflow: visible;
      display: flex;
      flex-shrink: 0;
    }

    .thrs {
      -ms-overflow-style: none; /* for Internet Explorer, Edge */
      scrollbar-width: none; /* for Firefox */
      overflow-y: scroll;
      overflow-x: scroll; // Must be set to stop any overflows causing scroll sync issues
      width: 100%;
      display: flex;
    }

    .thrs::-webkit-scrollbar {
      display: none; /* for Chrome, Safari, and Opera */
    }

    .dataTableCell_wrap{
      width: 100%;
      height: 100%;
    }

    .dataTableCell_wrap {
      position: absolute;
    }
  }
`;

function TableHeadings({ headerRef, columns, tableWidth, headerHeight, cellStyleOverrides }) {
  return (
    <div className="thrs" ref={headerRef}>
      <div
        style={{
          width: tableWidth,
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

function TableRowWrap(tableWidth, columnWidths, componentMap, columns, speedUpScrolling) {
  const TableRow = ({ index, style, isScrolling }) => {
    // const rowData = data[index];
    const CellComponent = isScrolling && speedUpScrolling ? CellSimple : Cell;

    return (
      <div className="tr" role="tr" style={{ ...style, width: tableWidth + 100 }} key={index}>
        {columns.map((column, columnIndex) => {
          return (
            <div
              className="td"
              role="td"
              key={`${index}-${columnIndex}`}
              style={{ width: columnWidths[columnIndex] }}
            >
              <CellComponent
                rowIndex={index}
                columnIndex={columnIndex}
                componentMap={componentMap}
                // headingsData={columns}
                headingData={column}
                // rowData={rowData}
              />
            </div>
          );
        })}
      </div>
    );
  };
  return TableRow;
}

/** Data Table Component
 * Converts an array of objects to a table by mapping against a column schema(headingsData)
 *
 */
export const DataTableUi = ({
  headingsData,
  rowStyles, // per row style overrides
  currentSelectionIds,
  componentMap,
  disabled,
  invalidRowsMessages,
  // TODO: Get from config
  rowHeight = 35,
  headerHeight = 40,
  totalsHeight = 40,
}) => {
  useEffect(() => {
    /* Check inputs */
    if (!componentMap) throw Error('Must supply component Map');
  }, [componentMap]);
  const { rowCount } = useContext(TableStateContext);

  const {
    minWidth,
    maxWidth,
    showTotals,
    allowEditRow,
    allowRowDelete,
    allowRowEditPanel,
    allowSelection,
    allowAddRow,
    showHeadings,
    allowColumnResize,
    speedUpScrolling,
    allowCellFocus,
  } = useContext(DataTableContext);

  const { columnWidths, setColumnWidths, tableWidth } = useColumnManager({
    headingsDataList: headingsData,
    allowRowDelete,
    allowRowEditPanel,
    allowEditRow,
    minWidth,
    maxWidth,
  });

  /* Setup Scroll Sync */
  const headerRef = useRef(null);
  const innerBodyRef = useRef(null);
  const columnManagerRef = useRef(null);
  const totalsRef = useRef(null);

  const nodeRefs = useMemo(
    () => [innerBodyRef, columnManagerRef, headerRef, totalsRef],
    [innerBodyRef, columnManagerRef, headerRef, totalsRef]
  );

  useScrollSyncWrap({
    nodeRefs,
    options: {
      proportional: false,
    },
  });

  const RenderRow = React.useCallback(
    TableRowWrap(tableWidth, columnWidths, componentMap, headingsData, speedUpScrolling),
    [tableWidth, columnWidths, componentMap, headingsData, speedUpScrolling]
  );

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
    <Styles className="styleWrap">
      <div className="table_wrap">
        <AutoSizer>
          {({ height, width }) => (
            <div
              className="table_body"
              style={{
                width: width,
                height: height,
              }}
            >
              {showHeadings && (
                <TableHeadings
                  headerRef={headerRef}
                  columns={headingsData}
                  tableWidth={tableWidth + 200}
                  headerHeight={headerHeight}
                  cellStyleOverrides={(columnIndex) => ({
                    height: headerHeight,
                    // marginRight: columnIndex === headingsData.length - 1 ? 500 : 0,
                    // marginRight: columnIndex === columns.length - 1 ? scrollBarSize : 0,
                    width: columnWidths[columnIndex],
                  })}
                />
              )}
              <FixedSizeList
                height={
                  height - (showHeadings ? headerHeight : 0) - (showTotals ? totalsHeight : 0)
                }
                itemCount={rowCount}
                itemSize={rowHeight}
                width="100%"
                outerRef={innerBodyRef}
                useIsScrolling
                // itemData={tableData}
                overscanCount={2}
              >
                {RenderRow}
              </FixedSizeList>
              {/* {showTotals && (
                <TableHeadings
                  headerRef={totalsRef}
                  columns={headingsData}
                  tableWidth={tableWidth + 200}
                  headerHeight={headerHeight}
                  cellStyleOverrides={(columnIndex) => ({
                    height: headerHeight,
                    // marginRight: columnIndex === headingsData.length - 1 ? 500 : 0,
                    // marginRight: columnIndex === columns.length - 1 ? scrollBarSize : 0,
                    width: columnWidths[columnIndex],
                  })}
                />
              )} */}
            </div>
          )}
        </AutoSizer>
        {allowColumnResize && (
          <ColumnWidthManager
            setColumnWidths={setColumnWidths}
            columnWidths={columnWidths}
            innerRef={columnManagerRef}
            minWidth={minWidth}
            maxWidth={maxWidth}
            widthPadding={500}
            // showEdges
          />
        )}

        {/*
        {showTotals && (
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
  speedUpScrolling: PropTypes.bool,
};

DataTableUi.defaultProps = {
  totalsData: {},
  // updateSortBy: () => {
  //   throw new Error('Must implement updateSortBy');
  // },
  // addFilter: () => {
  //   throw new Error('addFilter not supplied');
  // },
  // updateValue: () => {
  //   throw new Error('updateValue not supplied');
  // },
  // acceptValue: () => {
  //   throw new Error('acceptValue not supplied');
  // },
  // resetValue: () => {
  //   throw new Error('resetValue not supplied');
  // },
  // deleteRow: () => {
  //   throw new Error('deleteRow not supplied');
  // },
  // handleHideColumn: () => {
  //   throw new Error('handleHideColumn not supplied');
  // },
  // addToSelection: () => {
  //   throw new Error('addToSelection not supplied ');
  // },
  // removeFromSelection: () => {
  //   throw new Error('removeFromSelection not supplied ');
  // },
  // handleAddRow: () => {
  //   throw new Error('handleAddRow not supplied ');
  // },
  rowStyles: null,
  maxTableHeight: 2000,
  maxTableWidth: 2000,
  disabled: false,
  invalidRowsMessages: [],
  speedUpScrolling: false,
};

export const DataTableUiWithConfig = DataTableConfigConnector({})(DataTableUi);
