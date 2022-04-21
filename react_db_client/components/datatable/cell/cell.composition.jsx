import React, { useState, useMemo } from 'react';
import {
  DataTableContext,
  dataTableDefaultConfig,
} from '@samnbuk/react_db_client.components.datatable.logic';
import { VariableSizeGrid as Grid } from 'react-window';
import ReactJson from 'react-json-view';
import { CompositionWrapDefault } from '@samnbuk/react_db_client.helpers.composition-wraps';
import { Cell } from './cell';
import {
  demoHeadingsData,
  demoTableData,
} from '@samnbuk/react_db_client.components.datatable.extras';

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
      <Cell {...props} />
    </DataTableContext.Provider>
  );
};

const useHandleTableState = () => {
  const [editMode, setEditMode] = useState(false);
  const [navigationMode, setNavigationMode] = useState(true);
  const [currentFocusedColumn, setCurrentFocusedColumn] = useState(0);
  const [currentFocusedRow, setCurrentFocusedRow] = useState(0);

  const handleValueAccept = () => {};
  const handleValueChange = () => {};
  const handleValueReset = () => {};
  const handleMoveFocusToTargetCell = (i, j) => {
    // console.log(`Hovered: ${i}-${j}`);
    setCurrentFocusedColumn(j);
    setCurrentFocusedRow(i);
  };

  const methods = {
    handleValueAccept,
    handleValueChange,
    handleValueReset,
    handleMoveFocusToTargetCell,
    setNavigationMode,
    setEditMode,
  };

  const tableState = {
    tableData: Object.values(demoTableData),
    editMode,
    navigationMode,
    currentFocusedColumn,
    currentFocusedRow,
  };

  return {
    methods,
    tableState,
  };
};

const WrapMultipleCells = ({ override = {} }) => {
  const [columnIndex, setColumnIndex] = useState(0);

  const { methods, tableState } = useHandleTableState();

  return (
    <div>
      <input
        type="number"
        value={columnIndex}
        onChange={(e) => setColumnIndex(parseInt(e.target.value))}
      />
      <CompositionWrapDefault width="16rem" height="16rem" horizontal>
        <div className="columnA" style={{ width: '50%' }}>
          <div style={{ height: '50%' }}>
            <WrapComponent
              rowIndex={0}
              columnIndex={columnIndex}
              methods={methods}
              override={override}
              tableState={tableState}
            />
          </div>
          <div style={{ height: '50%' }}>
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
          <div style={{ height: '50%' }}>
            <WrapComponent
              rowIndex={0}
              columnIndex={columnIndex + 1}
              methods={methods}
              override={override}
              tableState={tableState}
            />
          </div>
          <div style={{ height: '50%' }}>
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

const tableData = Object.values(demoTableData).slice(0,4);

const reactWindowCellWrap =
  (CellComponent) =>
  ({ data, ...reactWindowCellProps }) => {
    return (
      <div style={{outline: '1px solid red'}}>
        hello: {reactWindowCellProps.columnIndex} : {reactWindowCellProps.rowIndex}
      </div>
    )
    return <CellComponent {...{ ...reactWindowCellProps, ...data }} />;
  };

const WindowCell = reactWindowCellWrap(Cell);



export const WithReactWindow = () => {
  const [columnIndex, setColumnIndex] = useState(0);
  const { methods, tableState } = useHandleTableState();

  const columnWidths = [300, 100];
  const columnCount = columnWidths.length;
  const rowCount = tableData.length;
  const tableWidthMin = 500;

  // Props to pass to Cell
  const getCellData = useMemo(
    () => ({
      ...defaultProps,
      tableState,
      methods,
    }),
    [tableData, methods]
  );

  return (
    <div>
      <input
        type="number"
        value={columnIndex}
        onChange={(e) => setColumnIndex(parseInt(e.target.value))}
      />
      <CompositionWrapDefault width="16rem" height="16rem" horizontal>
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
      </CompositionWrapDefault>
      <div className="">
        {tableState.currentFocusedColumn} : {tableState.className}
      </div>
      <div>
        <ReactJson src={demoHeadingsData[columnIndex]} />
        {/* <ReactJson src={demoHeadingsData} /> */}
      </div>
    </div>
  );
};
