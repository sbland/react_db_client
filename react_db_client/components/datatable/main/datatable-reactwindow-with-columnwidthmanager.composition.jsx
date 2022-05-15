import React, { useEffect, useRef, useMemo, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import useScrollSync from 'react-scroll-sync-hook';
import styled from 'styled-components';
import { useTable, useBlockLayout } from 'react-table';
import { FixedSizeList } from 'react-window';
import { RightClickWrapper } from '@samnbuk/react_db_client.components.popup-menu';
import { DataTableCellSelect } from '@samnbuk/react_db_client.components.datatable.cell-types';

import {
  ColumnWidthManager,
  useColumnManager,
} from '@react_db_client/components.column-manager';

import { CompositionWrapDefault } from '@samnbuk/react_db_client.helpers.composition-wraps';

import {
  demoHeadingsData,
  demoTableData,
} from '@samnbuk/react_db_client.components.datatable.extras';

const columns = demoHeadingsData;

const columnsWithAccessor = columns.map((c) => {
  return {
    ...c,
    accessor: c.uid,
    // accessor: (row, i) => row[c.uid]
  };
});

const data = Array(5)
  .fill(0)
  .reduce((acc, _) => [...acc, ...Object.values(demoTableData)], []);

const scrollbarWidth = () => {
  // thanks too https://davidwalsh.name/detect-scrollbar-width
  const scrollDiv = document.createElement('div');
  scrollDiv.setAttribute(
    'style',
    'width: 100px; height: 100px; overflow: scroll; position:absolute; top:-9999px;'
  );
  document.body.appendChild(scrollDiv);
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
};

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
      padding: 0.5rem;
      box-sizing: border-box;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      flex-shrink: 0;

      :last-child {
        border-right: 1px solid black;
        // margin-right: 12px; // TODO: should be scroll bar width
      }
    }
    .table_body {
      overflow: hidden;
      // overflow: auto hidden;
      div {
        // -ms-overflow-style: none; /* for Internet Explorer, Edge */
        // scrollbar-width: none; /* for Firefox */
      }
    }
    .table_body_row {
      margin-right: -20px;
      todo: should be scroll bar width;
    }

    .thrs {
      -ms-overflow-style: none; /* for Internet Explorer, Edge */
      scrollbar-width: none; /* for Firefox */
      overflow-y: scroll;
    }

    .thrs::-webkit-scrollbar {
      display: none; /* for Chrome, Safari, and Opera */
    }
  }
`;

const DEFAULT_COLUMN_WIDTH = 120;

function TableHeadings({ headerRef, headerGroups, tableWidth, headerHeight, cellStyleOverrides }) {
  return (
    <div className="thrs" style={{ width: '100%', overflow: 'auto hidden' }} ref={headerRef}>
      {headerGroups.map((headerGroup) => (
        <div
          {...headerGroup.getHeaderGroupProps()}
          style={{
            ...headerGroup.getHeaderGroupProps().style,
            width: tableWidth,
            position: 'relative',
            height: headerHeight,
          }}
          className="tr"
        >
          {headerGroup.headers.map((column, columnIndex) => (
            <div
              {...column.getHeaderProps()}
              className="th"
              style={{
                ...column.getHeaderProps().style,
                ...cellStyleOverrides(columnIndex),
                // height: headerHeight,
                // marginRight: columnIndex === columns.length - 1 ? scrollBarSize : 0,
                // position: 'absolute',
                // left: columnWidths.slice(0, columnIndex).reduce((acc, v) => acc + v, 0),
                // width: columnWidths[columnIndex],
              }}
            >
              {column.render('label')}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function TableRowWrap(rows, prepareRow, tableWidth, columnWidths, scrollBarSize) {
  const TableRow = ({ index, style }) => {
    const row = rows[index];
    prepareRow(row);
    return (
      <div
        {...row.getRowProps({
          style: {
            ...style,
            width: tableWidth,
          },
        })}
        className="tr table_body_row"
      >
        {row.cells.map((cell, cellIndex) => {
          return (
            <RightClickWrapper
              items={[
                { uid: 'clearCell', label: 'Clear', onClick: () => console.log('Clear') },
                {
                  uid: 'setDefault',
                  label: 'Set as Default',
                  onClick: () => console.log('setAsDefault'),
                },
              ]}
              //TODO: How do we make this generic?
              popupRoot="root"
            >
              <div
                {...cell.getCellProps()}
                className="td"
                style={{
                  ...cell.getCellProps().style,
                  marginRight: cellIndex === columns.length - 1 ? scrollBarSize : 0,
                  width: columnWidths[cellIndex],
                }}
              >
                {/* <DataTableCellSelect
                  columnData={columns[cellIndex]}
                  cellData={null}
                  editMode
                  focused
                  resetValue={() => {}}
                  acceptValue={() => {}}
                /> */}
                {cell.render('Cell')}
              </div>
            </RightClickWrapper>
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

function ReactWindowTable({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const headerRef = useRef(null);
  const bodyRef = useRef(null);
  const innerBodyRef = useRef(null);

  const nodeRefs = useMemo(
    () => [headerRef, bodyRef, innerBodyRef],
    [headerRef, bodyRef, innerBodyRef]
  );

  const [columnWidths, setColumnWidths] = useState(
    columns.map((c) => c.width || DEFAULT_COLUMN_WIDTH)
  );

  useScrollSyncWrap({ nodeRefs });

  const defaultColumn = React.useMemo(
    () => ({
      width: 150,
    }),
    []
  );

  const scrollBarSize = React.useMemo(() => scrollbarWidth(), []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, totalColumnsWidth, prepareRow } =
    useTable(
      {
        columns,
        data,
        defaultColumn,
      },
      useBlockLayout
    );

  const resizedTableWidth = columnWidths.reduce((acc, v) => acc + v, 0) + scrollBarSize * 2;

  const RenderRow = React.useCallback(
    TableRowWrap(rows, prepareRow, resizedTableWidth, columnWidths, scrollBarSize),
    [prepareRow, rows, resizedTableWidth, columnWidths, scrollBarSize]
  );

  const rowCount = rows.length;
  const rowHeight = 35;
  const headerHeight = 40;

  // Render the UI for your table
  return (
    <>
      <div {...getTableProps()} className="table" style={{ width: '100%', overflow: 'hidden' }}>
        <ColumnWidthManager
          setColumnWidths={setColumnWidths}
          columnWidths={columnWidths}
          // showEdges
          // minWidth={minWidth}
          // maxWidth={maxWidth}
        />

        <TableHeadings
          headerRef={headerRef}
          headerGroups={headerGroups}
          tableWidth={resizedTableWidth}
          headerHeight={headerHeight}
          cellStyleOverrides={(columnIndex) => ({
            height: headerHeight,
            marginRight: columnIndex === columns.length - 1 ? scrollBarSize : 0,
            width: columnWidths[columnIndex],
          })}
        />
        <AutoSizer>
          {({ height, width }) => (
            <div
              {...getTableBodyProps()}
              className="table_body"
              style={{
                width: width,
                height: height - headerHeight,
              }}
            >
              <FixedSizeList
                height={height - headerHeight + scrollBarSize}
                itemCount={rowCount}
                itemSize={rowHeight}
                width="100%"
                outerRef={innerBodyRef}
              >
                {RenderRow}
              </FixedSizeList>
              <div style={{ width: totalColumnsWidth }}></div>
              {/* TODO: Add a dummy div with the scroll bar */}
              <div>
                <div
                  style={{
                    width: '100%',
                    overflow: 'auto hidden',
                    position: 'absolute',
                    bottom: 0,
                  }}
                  ref={bodyRef}
                >
                  <div style={{ width: totalColumnsWidth, height: '1px' }}></div>
                </div>
              </div>
            </div>
          )}
        </AutoSizer>
      </div>
    </>
  );
}

export const ResizableReactWindowTable = () => {
  return (
    <CompositionWrapDefault width="16rem" height="16rem" horizontal>
      <Styles>
        <ReactWindowTable data={data} columns={columnsWithAccessor} />
      </Styles>
    </CompositionWrapDefault>
  );
};

