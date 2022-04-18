import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  demoTableData,
  demoHeadingsData,
} from '@samnbuk/react_db_client.components.datatable.extras';
import { DataTableUiWithConfig } from './DataTableUi';
import {
  DataTableContext,
  dataTableDefaultConfig,
} from '@samnbuk/react_db_client.components.datatable.logic';
import { defaultComponentMap } from '@samnbuk/react_db_client.components.datatable.components';
import { CompositionWrapDefault } from '@samnbuk/react_db_client.helpers.composition-wraps';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from './theme';
import { useHandleTableState } from './use-handle-table-state';

const DEMO_TABLE_DATA = Array(5)
  .fill(0)
  .reduce((acc, _) => [...acc, ...Object.values(demoTableData)], []);

// const DEMO_TABLE_DATA = Object.values(demoTableData);

const customCellNode = () => <div className="">CustomCELL</div>;

const methods = {
  updateSortBy: () => {},
  addFilter: () => {},
  updateValue: () => {},
  acceptValue: () => {},
  resetValue: () => {},
  deleteRow: () => {},
  handleHideColumn: () => {},
  addToSelection: () => {},
  removeFromSelection: () => {},
  handleAddRow: () => {},
  setNavigationMode: () => {},
  setCurrentFocusedRow: () => {},
  setCurrentFocusedColumn: () => {},
  setEditMode: () => {},
  handleCellKeyPress: () => {},
  onCellChange: () => {},
  onCellAccept: () => {},
  onCellReset: () => {},
  onCellSelect: () => {},
  onCellHover: () => {},
};

const initialTableState = {
  navigationMode: true,
  editMode: false,
  currentFocusedRow: 0,
  currentFocusedColumn: 0,
  tableData: DEMO_TABLE_DATA,
};

const defaultProps = {
  componentMap: defaultComponentMap(),
  headingsData: demoHeadingsData,
  currentSelectionIds: [],
  methods,
  tableState: initialTableState,

  rowStyles: null,
  handleHideColumn: null,
  maxTableHeight: null,
  maxTableWidth: null,
  disabled: null,
  invalidRowsMessages: null,
};

export const DataTableUiBase = () => (
  <CompositionWrapDefault width="16rem" height="16rem" horizontal>
    <ThemeProvider theme={lightTheme}>
      <DataTableUiWithConfig {...defaultProps} />
    </ThemeProvider>
  </CompositionWrapDefault>
);

export const DataTableUiNavigation = () => {
  const { methods, tableState } = useHandleTableState({
    columns: defaultProps.headingsData,
    initialData: Object.values(DEMO_TABLE_DATA),
  });

  return (
    <>
      <div>Edit mode: {tableState.editMode ? 'yes' : 'no'}</div>
      <div>navigation mode: {tableState.navigationMode ? 'yes' : 'no'}</div>
      <div>currentFocusedColumn: {tableState.currentFocusedColumn}</div>
      <div>currentFocusedRow: {tableState.currentFocusedRow}</div>
      <CompositionWrapDefault width="16rem" height="16rem" horizontal>
        <ThemeProvider theme={lightTheme}>
          <DataTableUiWithConfig {...defaultProps} methods={methods} tableState={tableState} />
        </ThemeProvider>
      </CompositionWrapDefault>
    </>
  );
};

// export const DefaultManagedState = () => {
//   const [tableData, setTableData] = useState(DEMO_TABLE_DATA);
//   const updateValue = (newVal, rowId, rowIndex, columnId) => {
//     setTableData((prev) => {
//       const dataCopy = cloneDeep(prev);
//       dataCopy[rowIndex][columnId] = newVal;
//       return dataCopy;
//     });
//   };
//   const rowStyles = tableData.map((row) => {
//     return row.count < 5
//       ? {
//           background: 'red',
//         }
//       : {};
//   });
//   return (
//     <DataTableUiWithConfig
//       {...defaultProps}
//       // componentMap={{ ...defaultProps.componentMap, custom: customCellNode }}
//       // tableData={tableData}
//       // headingsData={[...demoHeadingsData, { uid: 'custom', label: 'custom', type: 'custom' }]}
//       // methods={{
//       //   ...defaultProps.methods,
//       //   updateValue,
//       //   acceptValue: updateValue,

//       // }}
//       // rowStyles={rowStyles}
//     />
//   );
// };
// export const DefaultManagedStateAccept = () => {
//   // const [focusedColumn, setFocusedColumn] = useState(0);
//   const [tableData, setTableData] = useState(DEMO_TABLE_DATA);

//   // const handleCellHover = (r, c) => {
//   //   setFocusedColumn(c);
//   // };

//   const updateValue = (newVal, rowId, rowIndex, colId) => {
//     setTableData((prev) => {
//       const n = cloneDeep(prev);
//       n[rowIndex][colId] = newVal;
//       return n;
//     });
//     // updateValue(newVal, rowId, rowIndex, colId);
//   };

//   const acceptValue = (newVal, rowId, rowIndex, colId) => {
//     // acceptValue(newVal, rowId, rowIndex, colId);
//   };

//   const resetValue = (rowId, rowIndex, colId) => {
//     setTableData((prev) => {
//       const n = cloneDeep(prev);
//       n[rowIndex][colId] = DEMO_TABLE_DATA[rowIndex][colId];
//       return n;
//     });
//   };

//   return (
//     <DataTableContext.Provider value={{ ...dataTableDefaultConfig, hasBtnsColumn: false }}>
//       <DataTableUi
//         {...defaultProps}
//         headingsData={demoHeadingsData}
//         tableData={tableData}
//         // totalsData={totalsData}
//         // updateSortBy={updateSortBy}
//         // addFilter={addFilter}
//         updateValue={updateValue}
//         acceptValue={acceptValue}
//         resetValue={resetValue}
//         // deleteRow={deleteRow}
//         // rowStyles={rowStyles} // per row style overrides
//         // handleHideColumn={handleHideColumn}
//         tableHeight={200}
//         currentSelectionIds={[]}
//         // addToSelection={addToSelection}
//         // removeFromSelection={removeFromSelection}
//       />
//     </DataTableContext.Provider>
//   );
// };

// storiesOf('Data Table - Condensed Theme', module)
//   .add('with text', () => (
//     <DataTable
//       tableData={demoTableData}
//       headingsData={demoHeadingsData}
//       handleSaveData={(data) => console.log(data)}
//       showTotals
//       config={{
//         theme: 'condensed',
//       }}
//     />
//   ))
//   .add('with text - limit height', () => (
//     <DataTable
//       tableData={demoTableDataLong}
//       headingsData={demoHeadingsData}
//       handleSaveData={(data) => console.log(data)}
//       // showTotals
//       config={{
//         theme: 'condensed',
//         limitHeight: '20rem',
//       }}
//     />
//   ))
//   .add('with text autosave', () => (
//     <DataTable
//       config={{
//         theme: 'condensed',
//       }}
//       tableData={demoTableData}
//       headingsData={demoHeadingsData}
//       handleSaveData={(data) => console.log(data)}
//       showTotals
//       autosave
//     />
//   ))
//   .add('Simple', () => (
//     <DataTableSimple
//       config={{
//         theme: 'condensed',
//       }}
//       tableData={Object.values(demoTableData)}
//       headingsData={demoHeadingsData}
//     />
//   ))
//   .add('SimpleFunc', () => (
//     <DataTableSimpleFunc
//       config={{
//         theme: 'condensed',
//       }}
//       tableData={Object.values(demoTableData)}
//       headingsData={demoHeadingsData}
//     />
//   ))
//   .add('return totals', () => (
//     <DemoTotalsWrapper />
//   ));
