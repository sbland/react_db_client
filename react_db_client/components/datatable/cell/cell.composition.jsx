import React, { useState, useMemo } from 'react';
import {
  DataTableContext,
  dataTableDefaultConfig,
} from '@samnbuk/react_db_client.components.datatable.config';
import { VariableSizeGrid as Grid } from 'react-window';
import ReactJson from 'react-json-view';
import { CompositionWrapDefault } from '@react_db_client/helpers.composition-wraps';
import { Cell } from './cell';
import { ThemeProvider } from 'styled-components';
import {
  demoHeadingsData,
  demoTableData,
} from '@samnbuk/react_db_client.components.datatable.extras';
import {
  TableMethodsContext,
  TableStateContext,
} from '@samnbuk/react_db_client.components.datatable.state';
import { useHandleTableState } from '@samnbuk/react_db_client.components.datatable.state';

import { defaultProps, placeholderMethods } from './demo-props';

const WrapComponent = ({
  rowIndex = 0,
  columnIndex = 0,
  override = {},
  methods = defaultProps.methods,
  tableState = defaultProps.tableState,
} = {}) => {
  const props = {
    ...defaultProps,
    rowIndex,
    columnIndex,
    methods,
    tableState,
    ...override,
  };
  return (
    <DataTableContext.Provider value={dataTableDefaultConfig}>
      <ThemeProvider theme={{}}>
        <TableStateContext.Provider value={tableState}>
          <TableMethodsContext.Provider value={methods}>
            <Cell {...props} />
          </TableMethodsContext.Provider>
        </TableStateContext.Provider>
      </ThemeProvider>
    </DataTableContext.Provider>
  );
};

// const useHandleTableState = () => {
//   const [editMode, setEditMode] = useState(false);
//   const [navigationMode, setNavigationMode] = useState(true);
//   const [currentFocusedColumn, setCurrentFocusedColumn] = useState(0);
//   const [currentFocusedRow, setCurrentFocusedRow] = useState(0);

//   const onCellAccept = () => {};
//   const onCellChange = () => {};
//   const onCellReset = () => {};
//   const onCellKeyPress = (i, j) => {
//     // console.log(`Hovered: ${i}-${j}`);
//     setCurrentFocusedColumn(j);
//     setCurrentFocusedRow(i);
//   };

//   const methods = {
//     onCellAccept,
//     onCellChange,
//     onCellReset,
//     onCellKeyPress,
//     setNavigationMode,
//     setEditMode,
//   };

//   const tableState = {
//     tableData: Object.values(demoTableData),
//     editMode,
//     navigationMode,
//     currentFocusedColumn,
//     currentFocusedRow,
//   };

//   return {
//     methods,
//     tableState,
//   };
// };

const WrapMultipleCells = ({ override = {} }) => {
  const [columnIndex, setColumnIndex] = useState(0);

  const { methods, tableState } = useHandleTableState({
    columns: demoHeadingsData,
    initialData: Object.values(demoTableData),
  });

  const { _setEditMode, _setNavigationMode } = methods;

  const cellWrapStyle = {
    width: '100%',
    height: '50%',
    position: 'relative',
  };
  return (
    <div>
      <input
        type="number"
        value={columnIndex}
        onChange={(e) => setColumnIndex(parseInt(e.target.value))}
      />
      <button
        type="button"
        className="button-one"
        onClick={() => {
          _setEditMode((prev) => !prev);
          _setNavigationMode((prev) => !prev);
        }}
      >
        {tableState.editMode ? 'Edit' : 'nav'}
      </button>
      <CompositionWrapDefault width="16rem" height="16rem" horizontal>
        <div className="columnA" style={{ width: '50%' }}>
          <div style={cellWrapStyle}>
            <WrapComponent
              rowIndex={0}
              columnIndex={columnIndex}
              methods={methods}
              override={override}
              tableState={tableState}
            />
          </div>
          <div style={cellWrapStyle}>
            <WrapComponent
              rowIndex={1}
              columnIndex={columnIndex}
              methods={methods}
              override={override}
              tableState={tableState}
            />
          </div>
        </div>
        <div className="columnB" style={{ width: '50%' }}>
          <div style={cellWrapStyle}>
            <WrapComponent
              rowIndex={0}
              columnIndex={columnIndex + 1}
              methods={methods}
              override={override}
              tableState={tableState}
            />
          </div>
          <div style={cellWrapStyle}>
            <WrapComponent
              rowIndex={1}
              columnIndex={columnIndex + 1}
              methods={methods}
              override={override}
              tableState={tableState}
            />
          </div>
        </div>
      </CompositionWrapDefault>
      <div>
        <ReactJson src={demoHeadingsData[columnIndex]} />
        {/* <ReactJson src={demoHeadingsData} /> */}
      </div>
    </div>
  );
};

export const BasicCell = () => (
  <div>
    <WrapComponent />
  </div>
);

export const MultipleCells = () => (
  <div>
    <WrapMultipleCells />
  </div>
);

// const tableData = Object.values(demoTableData);
const tableData = Array(100)
  .fill(0)
  .reduce((acc, _) => [...acc, ...Object.values(demoTableData)], [])
  .map((row, i) => ({ ...row, uid: i}));


const reactWindowCellWrap =
  (CellComponent) =>
  ({ data, ...reactWindowCellProps }) => {
    return (
      <div
        style={{
          // outline: '1px solid red',
          ...reactWindowCellProps.style,

          display: 'inline-block',
          margin: 0,
          // position: relative,
          boxSizing: 'border-box',
          // borderBottom: '1px solid #D6DBDF',
          // borderRight: '1px solid #D6DBDF',
          lineHeight: '1.3em',
        }}
      >
        <CellComponent {...{ ...data, ...reactWindowCellProps, style: {} }} />
      </div>
    );
  };

const WindowCell = reactWindowCellWrap(Cell);

export const WithReactWindow = () => {
  const [columnIndex, setColumnIndex] = useState(0);
  const { methods, tableState } = useHandleTableState({
    columns: demoHeadingsData.slice(columnIndex, columnIndex + 2),
    initialData: Object.values(demoTableData),
  });

  const columnWidths = [100, 80];
  const columnCount = columnWidths.length;
  const rowCount = tableData.length;
  const tableWidthMin = 500;

  // Props to pass to Cell
  const getCellData = useMemo(
    () => ({
      ...defaultProps,
      columnIndex: undefined,
      rowIndex: undefined,
      headingsData: demoHeadingsData.slice(columnIndex, columnIndex + 2),
    }),
    [tableData, methods]
  );
  const { _setEditMode, _setNavigationMode } = methods;

  return (
    <div>
      <input
        type="number"
        value={columnIndex}
        onChange={(e) => setColumnIndex(parseInt(e.target.value))}
      />
      <button
        type="button"
        className="button-one"
        onClick={() => {
          _setEditMode((prev) => !prev);
          _setNavigationMode((prev) => !prev);
        }}
      >
        {tableState.editMode ? 'Edit' : 'nav'}
      </button>
      <CompositionWrapDefault width="16rem" height="16rem" horizontal>
        <DataTableContext.Provider value={dataTableDefaultConfig}>
          <ThemeProvider theme={{}}>
            <TableStateContext.Provider value={tableState}>
              <TableMethodsContext.Provider value={methods}>
                <Grid
                  // ref={gridRef}
                  className="Grid"
                  columnCount={columnCount}
                  columnWidth={(index) => columnWidths[index]}
                  height={100}
                  // height={Math.max(MIN_TABLE_HEIGHT, Math.min(tableData.length * 22 + 22, maxTableHeight))}
                  rowCount={rowCount}
                  rowHeight={() => 22}
                  width={tableWidthMin}
                  itemData={getCellData}
                >
                  {WindowCell}
                </Grid>
              </TableMethodsContext.Provider>
            </TableStateContext.Provider>
          </ThemeProvider>
        </DataTableContext.Provider>
      </CompositionWrapDefault>

      <div className="">
        {tableState.currentFocusedColumn} : {tableState.currentFocusedRow}
      </div>
      <div>
        <ReactJson src={demoHeadingsData[columnIndex]} />
        {/* <ReactJson src={demoHeadingsData} /> */}
      </div>
    </div>
  );
};
