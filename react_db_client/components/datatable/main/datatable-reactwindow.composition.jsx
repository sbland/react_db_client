import React, { useEffect, useRef, useMemo } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import useScrollSync from 'react-scroll-sync-hook';
import styled from 'styled-components';
import { useTable, useBlockLayout } from 'react-table';
import { FixedSizeList } from 'react-window';

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
  .table {
    height: 100%;

    .th,
    .td {
      margin: 0;
      padding: 0.5rem;
      // box-shadow: 1px 0px 0px 0px black, 0px 1px 0px 0px black;
      box-sizing: border-box;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

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

function ReactWindowTable({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const headerRef = useRef(null);
  const bodyRef = useRef(null);
  const innerBodyRef = useRef(null);

  const nodeRefs = useMemo(
    () => [headerRef, bodyRef, innerBodyRef],
    [headerRef, bodyRef, innerBodyRef]
  );

  const { registerPane, unregisterPane } = useScrollSync({
    enabled: true,
  });

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

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <div
          {...row.getRowProps({
            style: {
              ...style,
              width: totalColumnsWidth,
            },
          })}
          className="tr table_body_row"
        >
          {row.cells.map((cell, cellIndex) => {
            return (
              <div
                {...cell.getCellProps()}
                className="td"
                style={{
                  ...cell.getCellProps().style,
                  marginRight: cellIndex === columns.length - 1 ? scrollBarSize : 0,
                }}
              >
                {cell.render('Cell')}
              </div>
            );
          })}
        </div>
      );
    },
    [prepareRow, rows, totalColumnsWidth]
  );

  const rowCount = rows.length;
  const rowHeight = 35;
  const headerHeight = 40;

  // Render the UI for your table
  return (
    <div {...getTableProps()} className="table" style={{ width: '100%', overflow: 'hidden' }}>
      <div className="thrs" style={{ width: '100%', overflow: 'auto hidden' }} ref={headerRef}>
        {headerGroups.map((headerGroup) => (
          <div
            {...headerGroup.getHeaderGroupProps()}
            style={{
              ...headerGroup.getHeaderGroupProps().style,
              width: totalColumnsWidth,
            }}
            className="tr"
          >
            {headerGroup.headers.map((column, columnIndex) => (
              <div
                {...column.getHeaderProps()}
                className="th"
                style={{
                  ...column.getHeaderProps().style,
                  height: headerHeight,
                  marginRight: columnIndex === columns.length - 1 ? scrollBarSize : 0,
                }}
              >
                {column.render('label')}
              </div>
            ))}
          </div>
        ))}
      </div>

      <AutoSizer>
        {({ height, width }) => (
          <div
            {...getTableBodyProps()}
            className="table_body"
            style={{ width: width, height: height - headerHeight, position: 'relative' }}
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
                style={{ width: '100%', overflow: 'auto hidden', position: 'absolute', bottom: 0 }}
                ref={bodyRef}
              >
                <div style={{ width: totalColumnsWidth, height: '1px' }}></div>
              </div>
            </div>
          </div>
        )}
      </AutoSizer>
    </div>
  );
}

export const DefaultReactWindowTable = () => {
  return (
    <CompositionWrapDefault width="16rem" height="16rem" horizontal>
      <Styles>
        <ReactWindowTable data={data} columns={columnsWithAccessor} />
      </Styles>
    </CompositionWrapDefault>
  );
};
