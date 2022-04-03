import React, { useState } from 'react';
import {
  DataTableContext,
  dataTableDefaultConfig,
} from '@samnbuk/react_db_client.components.datatable.logic';
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
    console.log(`Hovered: ${i}-${j}`);
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
      <CompositionWrapDefault width="4rem" height="4rem" horizontal>
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

/* ============= Base table examples ================= */

import BaseTable, { Column, AutoResizer } from 'react-base-table';
import './_dataTable_baseTable.scss';
import { useCallback } from 'react';
import { useMemo } from 'react';

// const DEMO_TABLE_DATA = Object.values(demoTableData);

// const DEMO_CONFIG = { ...dataTableDefaultConfig, allowSelection: true };
// const DEMO_SORT_BY = { heading: 'count', direction: 1, map: null };

// const DEMO_HEADINGS = demoHeadingsData;
// const customFieldComponents = {
//   custom: CustomField,
//   customeval: DataTableCellNumber,
// };
// const customFilters = {
//   custom: customFilter,
// };
// const customFiltersComponents = { custom: FilterNumber };

// const defaultProps = {
//   data: DEMO_TABLE_DATA,
//   headings: DEMO_HEADINGS,
//   config: DEMO_CONFIG,
//   sortByOverride: DEMO_SORT_BY,
//   saveData: console.log,
//   calculateTotals: true,
//   styleOverride: { background: 'green' },
//   errorStyleOverride: { DUPLICATE: { background: 'red' }, MISSING: { background: 'orange' } },
//   onSelectionChange: (newSelection) => {
//     // alert('Selection changed');
//     console.log(newSelection);
//   },
//   customFieldComponents,
//   customFilters,
//   customFiltersComponents,
//   maxTableHeight: 2000,
// };

const Container = `
  width: calc(50vw + 220px);
  height: 50vh;
`;

const wrapperStyle = {
  height: '30rem',
};

const DEMO_TABLE_DATA = [
  {
    name: 'hello',
    count: 1,
  },
  {
    name: 'hellob',
    count: 5,
  },
  {
    name: 'helloc',
    count: 999,
  },
];

const defaultBaseTableProps = {
  data: DEMO_TABLE_DATA,
  width: 600,
  height: 400,
  rowKey: 'uid',
  rowHeight: 20,
};

export const BaseTableDefault = () => {
  return (
    <div style={wrapperStyle}>
      <BaseTable {...defaultBaseTableProps}>
        <Column key="name" dataKey="name" width={100} />
        <Column key="count" dataKey="count" width={100} />
      </BaseTable>
    </div>
  );
};
export const BaseTableResize = () => {
  return (
    <CompositionWrapDefault width="16rem" height="16rem" horizontal>
      <AutoResizer>
        {({ width, height }) => (
          <BaseTable {...defaultBaseTableProps} width={width} height={height}>
            <Column key="name" dataKey="name" width={300} />
            <Column key="count" dataKey="count" width={100} />
          </BaseTable>
        )}
      </AutoResizer>
    </CompositionWrapDefault>
  );
};

const CellDemo = (props) => {};

const columns = [
  {
    key: 'name',
    title: 'Name',
    dataKey: 'name',
    width: 300,
  },
  {
    key: 'count',
    title: 'count',
    dataKey: 'count',
    width: 60,
    // cellRenderer: ({ cellData: count }) => <div>{count}</div>,
  },
];

export function toString(value) {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  return value.toString ? value.toString() : '';
}

export const CustomComponents = () => {
  const { methods, tableState } = useHandleTableState();

  // const dataGetter = useCallback(({ columns, column, columnIndex, rowData, rowIndex }) => {
  //   return { hello: 'goodbye'}
  //   return {
  //     methods, tableState,
  //   }
  // }, [methods, tableState,]);
  const [state, setState] = useState(0);

  const dataGetter = ({ columns, column, columnIndex, rowData, rowIndex }) => {
    return { hello: 'goodbye', state };
    return {
      methods,
      tableState,
    };
  };

  const components = useMemo(
    () => ({
      TableCell: ({
        columnIndex,
        rowIndex,
        container: {
          props: { methods: _methods, tableState: _tableState },
        },
        cellData,
        // container: { methods: _methods, tableState: _tableState },
      }) => {
        console.log(cellData);
        // console.log(cellData?.tableState?.currentFocusedRow);
        return (
          <div className="">
            {cellData.state}
            <button type="button" className="button-one" onClick={() => console.log(state)}>
              click
            </button>
          </div>
        );
        return (
          <Cell
            {...defaultProps}
            columnIndex={columnIndex}
            rowIndex={rowIndex}
            style={{}}
            methods={_methods}
            tableState={_tableState}
          />
        );
      },
    }),
    [state]
  );

  // const getColumns = () => {
  //   return [
  //     {
  //       key: 'name',
  //       title: 'Name',
  //       dataKey: 'name',
  //       width: 300,
  //     },
  //     {
  //       key: 'count',
  //       title: 'count',
  //       dataKey: 'count',
  //       width: 60,
  //       // cellRenderer: ({ cellData: count }) => <div>{count}</div>,
  //     },
  //   ]
  // }

  const cellProps = ({ rowIndex, columnIndex }) => ({
    state,
  });

  return (
    <div>
      <CompositionWrapDefault width="16rem" height="16rem" horizontal>
        <AutoResizer>
          {({ width, height }) => (
            <BaseTable
              {...defaultBaseTableProps}
              // columns={columns}
              width={width}
              height={height}
              components={components}
              methods={methods}
              tableState={tableState}
              cellProps={cellProps}
            >
              {/* <Column key="name" dataKey="name" width={300} dataGetter={dataGetter} />
              <Column key="count" dataKey="count" width={100} dataGetter={dataGetter} /> */}
              <Column key="name" dataKey="name" width={300} />
              <Column key="count" dataKey="count" width={100} />
            </BaseTable>
          )}
        </AutoResizer>
      </CompositionWrapDefault>
      <div>
        INFO:
        {JSON.stringify(tableState)}
        {tableState.currentFocusedRow}
      </div>
      <button type="button" className="button-one" onClick={() => setState((prev) => prev + 1)}>
        click
      </button>
      {state}
    </div>
  );
};
// export const custom components b = () => {
//   const [data, setData] = useState(DEMO_TABLE_DATA);
//   const handleValueChange = (newVal, rowIndex, columnId) => {
//     const newData = [...data];
//     newData[rowIndex][columnId] = newVal;
//     console.log(newData);
//     setData(newData);
//   };
//   const components = {
//     TableCell: ({ columnIndex, rowIndex, cellData, rowData }) => {
//       const columnData = { type: 'text' };
//       const headingData = DEMO_HEADINGS[columnIndex];
//       const handleUpdateData = (newValue) =>
//         handleValueChange(newValue, rowIndex, headingData.uid);
//       return (
//         <DataTableDataCell
//           columnData={columnData}
//           updateData={handleUpdateData}
//           rowId={rowIndex}
//           columnId={columnIndex}
//           cellData={cellData}
//           acceptValue={() => {}}
//           resetValue={() => {}}
//           focused
//           editMode
//         />
//       );
//     },
//   };
//   return (
//     <div style={wrapperStyle}>
//       <BaseTable
//         {...defaultBaseTableProps}
//         data={data}
//         components={components}
//         ignoreFunctionInColumnCompare
//       >
//         <Column key="name" dataKey="name" width={100} />
//         <Column key="count" dataKey="count" width={100} />
//       </BaseTable>
//     </div>
//   );
// });
