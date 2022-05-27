import React from 'react';
// import { mount, shallow } from 'enzyme';
// import { MockEs6, MockReactC } from '../../Helpers/testing';
// // eslint-disable-next-line import/order
// import { VariableSizeGrid as Grid } from 'react-window';
// import DataTableUi, { DataTableUiWithConfig } from './DataTableUi';

// import { demoTableData, demoHeadingsData } from './demoData';
// import { DataTableContext, dataTableDefaultConfig } from './DataTableConfig/DataTableConfig';
// import DataTableHeadings from './DataTableHeadings';
// import DataTableColumnWidthManager from '../TableColumnManager/DataTableColumnWidthManager';
// import useColumnWidthManager from '../TableColumnManager/ColumnManager';
// import Cell from './DataTableCell/DataTableCell';

// jest.mock('react-window', () =>
//   MockReactC('react-window', [], {
//     VariableSizeGrid: ({ children }) =>
//       // NOTE: This is the only data passed to cells!
//       children({ rowIndex: 0, data: { headingsData: [], tableData: [] } }),
//   })
// );
// jest.mock('./DataTableRows', () => MockReactC('DataTableRows'));
// jest.mock('./DataTableHeadings', () => MockReactC('DataTableHeadings'));
// jest.mock('../TableColumnManager/DataTableColumnWidthManager', () =>
//   MockReactC('DataTableColumnWidthManager')
// );
// jest.mock('./DataTableTotals', () => MockReactC('DataTableTotals'));
// jest.mock('../TableColumnManager/ColumnManager', () => MockEs6('ColumnManager'));
// jest.mock('./DataTableCell/DataTableCell', () => MockReactC('Cell'));

// const updateSortBy = jest.fn();
// const addFilter = jest.fn();
// const updateValue = jest.fn();
// const acceptValue = jest.fn();
// const resetValue = jest.fn();
// const deleteRow = jest.fn();
// const setColumnWidths = jest.fn();
// const handleHideColumn = jest.fn();
// const defaultProps = {
//   headingsData: demoHeadingsData,
//   tableData: Object.values(demoTableData),
//   updateSortBy,
//   addFilter,
//   updateValue,
//   acceptValue,
//   resetValue,
//   deleteRow,
//   handleHideColumn,
//   totalsData: [],
//   config: dataTableDefaultConfig,
//   rowStyles: Object.values(demoTableData).map((_, i) => (i < 3 ? { background: 'red' } : {})),
//   currentSelectionIds: [],
//   customFieldComponents: {},
// };

// const defaultColumnWidths = defaultProps.headingsData.map(() => 10);
// const defaultColumnManagerReturn = {
//   columnWidths: defaultColumnWidths,
//   setColumnWidths,
//   tableWidth: dataTableDefaultConfig.maxWidth,
//   visableColumns: defaultProps.headingsData,
// };

// describe('DataTableUi', () => {
//   beforeEach(() => {
//     updateSortBy.mockClear();
//     addFilter.mockClear();
//     updateValue.mockClear();
//     acceptValue.mockClear();
//     resetValue.mockClear();
//     deleteRow.mockClear();
//     setColumnWidths.mockClear();
//     handleHideColumn.mockClear();
//     useColumnWidthManager.mockClear();
//     useColumnWidthManager.mockReturnValue(defaultColumnManagerReturn);
//   });
//   describe('shallow renders', () => {
//     test('Renders', () => {
//       const config = {
//         ...dataTableDefaultConfig,
//         allowEditRow: true,
//         allowRowDelete: true,
//         hasBtnsColumn: true,
//       };
//       shallow(
//         <DataTableContext.Provider value={config}>
//           <DataTableUi {...defaultProps} />
//         </DataTableContext.Provider>
//       )
//         .find(DataTableUi)
//         .dive();
//     });
//     test('Matches Snapshot', () => {
//       const component = shallow(
//         <DataTableContext.Provider value={dataTableDefaultConfig}>
//           <DataTableUi {...defaultProps} />
//         </DataTableContext.Provider>
//       )
//         .find(DataTableUi)
//         .dive();
//       const tree = component.debug();
//       expect(tree).toMatchSnapshot();
//     });
//   });
//   describe('Unit Tests', () => {
//     let component;
//     beforeEach(() => {
//       component = mount(<DataTableUiWithConfig {...defaultProps} />);
//     });
//     describe('Passing data to sub components', () => {
//       test('should Pass data to datatable width manager ', () => {
//         const widthManager = component.find(DataTableColumnWidthManager);
//         expect(widthManager.props().minWidth).toEqual(dataTableDefaultConfig.minWidth);
//       });
//       test('should pass data to Data table headings', () => {
//         const headings = component.find(DataTableHeadings);
//         expect(headings.props().headingsDataList).toEqual(defaultProps.headingsData);
//         expect(headings.props().columnWidths).toEqual(defaultColumnWidths);
//       });
//       test('should pass data to data table grid', () => {
//         const grid = component.find(Grid);
//         expect(grid.props().itemData.headingsData).toEqual(defaultProps.headingsData);
//         expect(grid.props().itemData.tableData).toEqual(defaultProps.tableData);
//       });
//       test.skip('should pass row styles to cells', () => {
//         // TODO: Find way to check this when cell mocked
//         const grid = component.find(Grid);
//         const dataTableCellHoverWrap = grid.find(Cell);
//         expect(dataTableCellHoverWrap.props().style.background).toEqual('red');
//       });
//     });
//     describe('Handle Value Changed', () => {
//       test('should pass update value call from rows to prop', () => {
//         const grid = component.find(Grid);
//         const newVal = 'new val';
//         const rowId = 'a';
//         const rowIndex = 1;
//         const columnId = 'Col 1';
//         grid.props().itemData.handleValueChange(newVal, rowId, rowIndex, columnId);
//         expect(updateValue).toHaveBeenCalledWith(newVal, rowId, rowIndex, columnId);
//       });
//     });
//     describe('Handle accept value', () => {
//       test('should pass update value call from rows to prop', () => {
//         const grid = component.find(Grid);
//         const newVal = 'new val';
//         const rowId = 'a';
//         const rowIndex = 1;
//         const columnId = 'Col 1';
//         grid.props().itemData.handleValueAccept(newVal, rowId, rowIndex, columnId);
//         expect(acceptValue).toHaveBeenCalledWith(newVal, rowId, rowIndex, columnId);
//       });
//     });
//     describe('Handle reset value', () => {
//       test('should pass update value call from rows to prop', () => {
//         const grid = component.find(Grid);
//         const rowId = 'a';
//         const rowIndex = 1;
//         const columnId = 'Col 1';
//         grid.props().itemData.handleValueReset(rowId, rowIndex, columnId);
//         expect(resetValue).toHaveBeenCalledWith(rowId, rowIndex, columnId);
//       });
//     });
//     describe('Deleting row', () => {
//       test('should call delete row when cell data calls delete row', () => {
//         const grid = component.find(Grid);
//         const rowIndex = 1;
//         const rowId = 'a';
//         grid.props().itemData.handleDeleteRow(rowId, rowIndex);
//         expect(deleteRow).toHaveBeenCalledWith(rowId, rowIndex);
//       });
//     });

//     describe('Resizing Columns', () => {
//       test('should adjust grid columns when column widht manager sets columns', () => {
//         let grid = component.find(Grid);
//         expect(grid.props().columnWidth(0)).toEqual(10);
//         const widthManager = component.find(DataTableColumnWidthManager);
//         const newWidths = [99, 99, 99, 99, 99];
//         widthManager.props().setColumnWidths(newWidths);
//         expect(setColumnWidths).toHaveBeenCalledWith(newWidths);
//         useColumnWidthManager.mockReturnValue({
//           ...defaultColumnManagerReturn,
//           columnWidths: newWidths,
//         });
//         component.setProps();
//         grid = component.find(Grid);
//         expect(grid.props().columnWidth(0)).toEqual(99);
//       });
//     });
//     describe('Changing input columns', () => {
//       test('should pass headings data to useColumnWidthManager', () => {
//         expect(useColumnWidthManager).toHaveBeenCalledWith({
//           headingsDataList: defaultProps.headingsData,
//           allowEditRow: defaultProps.config.allowEditRow,
//           allowRowDelete: defaultProps.config.allowRowDelete,
//           allowRowEditPanel: defaultProps.config.allowRowEditPanel,
//           minWidth: defaultProps.config.minWidth,
//           maxWidth: defaultProps.config.maxWidth,
//           btnColumnBtnCount: 1,
//         });
//       });
//       test('should change headings passed to columnWidthManager when headings prop changes', () => {
//         expect(useColumnWidthManager).toHaveBeenCalledWith({
//           headingsDataList: defaultProps.headingsData,
//           allowEditRow: defaultProps.config.allowEditRow,
//           allowRowDelete: defaultProps.config.allowRowDelete,
//           allowRowEditPanel: defaultProps.config.allowRowEditPanel,
//           minWidth: defaultProps.config.minWidth,
//           maxWidth: defaultProps.config.maxWidth,
//           btnColumnBtnCount: 1,
//         });
//         useColumnWidthManager.mockClear();
//         const newHeadingsData = defaultProps.headingsData.slice(1);
//         component.setProps({ headingsData: newHeadingsData });
//         expect(useColumnWidthManager).toHaveBeenCalledWith({
//           headingsDataList: newHeadingsData,
//           allowEditRow: defaultProps.config.allowEditRow,
//           allowRowDelete: defaultProps.config.allowRowDelete,
//           allowRowEditPanel: defaultProps.config.allowRowEditPanel,
//           minWidth: defaultProps.config.minWidth,
//           maxWidth: defaultProps.config.maxWidth,
//           btnColumnBtnCount: 1,
//         });
//       });
//     });
//     describe('Updating sort by', () => {
//       test('should calling update sort by from headings should call update sort by prop', () => {
//         const headings = component.find(DataTableHeadings);
//         const headingToSortBy = demoHeadingsData[0].uid;
//         headings.props().setSortBy(headingToSortBy);
//         expect(updateSortBy).toHaveBeenCalledWith(headingToSortBy);
//       });
//     });
//     describe('Selecting', () => {
//       test.skip('should pass current selection to ', () => {
//         //
//       });
//     });
//   });
// });
