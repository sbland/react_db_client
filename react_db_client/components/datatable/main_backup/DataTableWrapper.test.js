import React from 'react';
// import { mount, shallow } from 'enzyme';
// import { MockEs6, MockReactC } from '../../Helpers/testing';
// import DataTableWrapper, { DataTableWrapperFunc } from './DataTableWrapper';
// import {
//   demoFiltersData,
//   demoHeadingsData,
//   demoTableData,
//   demoTableDataEvaluated,
//   demoTableTotals,
// } from './demoData';
// import DataTableUi from './DataTableUi';
// import { dataTableDefaultConfig } from './DataTableConfig/DataTableConfig';
// import useDataManager from './DataManager/DataManager';
// import HiddenColumnsPanel from './HiddenColumnsPanel/HiddenColumnsPanel';
// import useColumnVisabilityManager from '../TableColumnManager/ColumnVisabilityManager';
// import FilterManager from '../FilterManager/FilterManager';
// import { arrayToObj } from '../../Helpers/objectArrayHelpers';
// import { useSelectionManager } from './SelectionManagerHook';

// // MODULE MOCKS
// jest.mock('./DataTableUi', () => MockReactC('DataTableUi'));
// jest.mock('./DataManager/DataManager', () => MockEs6('DataManager'));
// jest.mock('./SelectionManagerHook', () =>
//   MockEs6('SelectionManagerHook', {}, ['useSelectionManager'])
// );
// jest.mock('../TableColumnManager/ColumnVisabilityManager', () =>
//   MockEs6('ColumnVisabilityManager')
// );

// // FUNCTION MOCKS
// const saveData = jest.fn();
// const updateRowData = jest.fn();
// const handleValueChange = jest.fn();
// const handleValueAccept = jest.fn();
// const handleValueReset = jest.fn();
// const addNewRow = jest.fn();
// const handleDeleteRow = jest.fn();
// const resetData = jest.fn();
// const handleHideColumn = jest.fn();
// const updateTotals = jest.fn();
// const updatedDataHook = jest.fn();
// const handleSaveData = jest.fn();
// const onSelectionChange = jest.fn();
// const addToSelection = jest.fn();
// const removeFromSelection = jest.fn();
// const clearSelection = jest.fn();
// const selectAll = jest.fn();

// // DEMO DATA
// const DEMO_TABLE_DATA = Object.values(demoTableData);
// const DEMO_TABLE_DATA_PROCESSED = demoTableDataEvaluated;
// const DEMO_TOTALS = demoTableTotals;

// const DEMO_CONFIG = dataTableDefaultConfig;
// const DEMO_SORT_BY = { heading: 'count', direction: 1, map: null };
// const DEMO_FILTERS = demoFiltersData;

// const DEMO_HEADINGS = demoHeadingsData;
// const DEMO_HEADINGS_UNHIDDEN = DEMO_HEADINGS.filter((h) => !h.hidden);
// const DEMO_HEADINGS_HIDDEN_IDS = DEMO_HEADINGS.filter((h) => h.hidden).map((h) => h.uid);

// // DEFAULT PROPS
// const defaultProps = {
//   data: DEMO_TABLE_DATA,
//   headings: DEMO_HEADINGS,
//   config: DEMO_CONFIG,
//   sortByOverride: DEMO_SORT_BY,
//   filterOverride: DEMO_FILTERS,
//   saveData,
//   autoSave: false,
//   calculateTotals: true,
//   updateTotals,
//   updatedDataHook,
//   onSelectionChange,
//   customFilters: {},
// };

// const DEMO_DATAMANAGER_RETURN = {
//   dataUnProcessed: DEMO_TABLE_DATA,
//   dataProcessed: DEMO_TABLE_DATA_PROCESSED,
//   totals: DEMO_TOTALS,
//   unsavedChanges: false,
//   updateRowData,
//   handleValueChange,
//   handleValueAccept,
//   handleValueReset,
//   addNewRow,
//   handleDeleteRow,
//   resetData,
//   handleSaveData,
//   error: null,
//   invalidRows: [],
//   invalidRowsMessages: [],
// };

// const DEMO_COLUMNMANAGER_RETURN = {
//   handleHideColumn,
//   visableColumns: DEMO_HEADINGS_UNHIDDEN,
//   hiddenColumnIds: DEMO_HEADINGS_HIDDEN_IDS,
// };

// const DEMO_SELECTION_HOOK_RETURN = {
//   currentSelection: [],
//   currentSelectionIds: [],
//   addToSelection,
//   removeFromSelection,
//   clearSelection,
//   selectAll,
// };

// describe('DataTableWrapper', () => {
//   beforeEach(() => {
//     useDataManager.mockClear();
//     useDataManager.mockReturnValue(DEMO_DATAMANAGER_RETURN);
//     useColumnVisabilityManager.mockReturnValue(DEMO_COLUMNMANAGER_RETURN);
//     useSelectionManager.mockReturnValue(DEMO_SELECTION_HOOK_RETURN);
//     saveData.mockClear();
//     handleSaveData.mockClear();
//     updateRowData.mockClear();
//     handleValueChange.mockClear();
//     handleValueAccept.mockClear();
//     handleValueReset.mockClear();
//     addNewRow.mockClear();
//     handleDeleteRow.mockClear();
//     resetData.mockClear();
//     handleHideColumn.mockClear();
//     updateTotals.mockClear();
//     updatedDataHook.mockClear();
//     onSelectionChange.mockClear();
//   });
//   test('Renders', () => {
//     shallow(<DataTableWrapperFunc {...defaultProps} />);
//   });
//   describe('shallow renders', () => {
//     test('Matches Snapshot', () => {
//       const component = shallow(<DataTableWrapperFunc {...defaultProps} />);
//       const tree = component.debug();
//       expect(tree).toMatchSnapshot();
//     });
//   });
//   describe('Unit tests', () => {
//     let component;
//     beforeEach(() => {
//       component = mount(<DataTableWrapper {...defaultProps} />);
//     });
//     describe('data flow', () => {
//       test('should pass data to tableUi', () => {
//         const tableUi = component.find(DataTableUi);
//         expect(tableUi.props().headingsData).toEqual(DEMO_HEADINGS_UNHIDDEN);
//         expect(tableUi.props().tableData).toEqual(DEMO_TABLE_DATA_PROCESSED);
//         expect(tableUi.props().totalsData).toEqual(DEMO_TOTALS);
//         expect(typeof tableUi.props().updateSortBy).toEqual('function');
//         expect(typeof tableUi.props().addFilter).toEqual('function');
//         expect(typeof tableUi.props().updateValue).toEqual('function');
//         expect(typeof tableUi.props().acceptValue).toEqual('function');
//         expect(typeof tableUi.props().resetValue).toEqual('function');
//         expect(typeof tableUi.props().deleteRow).toEqual('function');
//         expect(typeof tableUi.props().handleHideColumn).toEqual('function');
//       });
//       test('should pass data to datamanager', () => {
//         expect(useDataManager).toHaveBeenCalledWith({
//           data: DEMO_TABLE_DATA,
//           headings: DEMO_HEADINGS,
//           filters: DEMO_FILTERS,
//           sortBy: DEMO_SORT_BY,
//           calculateTotals: defaultProps.calculateTotals,
//           autoSave: defaultProps.autoSave,
//           autoSaveCallback: saveData,
//           autoSort: true,
//           autoFilter: true,
//           saveTotalsCallback: updateTotals,
//           autoSaveOnNewRow: false,
//           updatedDataHook,
//           customFilters: defaultProps.customFilters,
//         });
//       });
//     });
//     describe('filter panel', () => {
//       test('should show filter panel', () => {
//         const filterPanel = component.find(FilterManager);
//         expect(filterPanel).toBeTruthy();
//         expect(filterPanel.props().filterData).toEqual(DEMO_FILTERS);
//         expect(filterPanel.props().fieldsData).toEqual(arrayToObj(DEMO_HEADINGS, 'uid'));
//       });
//       test('should update filters from filter panel', () => {
//         useDataManager.mockClear();
//         const filterPanel = component.find(FilterManager);
//         const updatedFilterData = { filters: 'updated' };
//         filterPanel.props().updateFilter(0, updatedFilterData);
//         expect(useDataManager.mock.calls[0][0].filters).toEqual([
//           updatedFilterData,
//           DEMO_FILTERS[1],
//         ]);
//       });
//     });
//     describe('Hidden column panel', () => {
//       test('should show hidden columns panel', () => {
//         const hiddenColumnsPanel = component.find(HiddenColumnsPanel);
//         expect(hiddenColumnsPanel).toBeTruthy();
//         expect(hiddenColumnsPanel.props().hiddenColumnIds).toEqual(DEMO_HEADINGS_HIDDEN_IDS);
//       });
//       test('should unhide column from hidden column panel', () => {
//         const hiddenColumnsPanel = component.find(HiddenColumnsPanel);
//         hiddenColumnsPanel.props().handleUnhideColumn(1);
//         expect(handleHideColumn).toHaveBeenCalledWith(1);
//       });
//     });
//     describe('Save and reset', () => {
//       const setUnsavedChanges = (c) => {
//         useDataManager.mockReturnValue({
//           ...DEMO_DATAMANAGER_RETURN,
//           unsavedChanges: true,
//         });
//         c.setProps();
//       };

//       describe('Save Btn', () => {
//         test('should disable save btn until there have been changes', () => {
//           let saveBtn = component.find('.saveBtn');
//           expect(saveBtn.props().disabled).toEqual(true);
//           setUnsavedChanges(component);
//           saveBtn = component.find('.saveBtn');
//           expect(saveBtn.props().disabled).toEqual(false);
//         });
//         test('should call save function on save btn click', () => {
//           setUnsavedChanges(component);
//           const saveBtn = component.find('.saveBtn');
//           saveBtn.simulate('click');
//           expect(handleSaveData).toHaveBeenCalledWith();
//         });
//       });
//       describe('Reset Btn', () => {
//         test('should disable reset btn until there have been changes', () => {
//           let resetBtn = component.find('.resetBtn');
//           expect(resetBtn.props().disabled).toEqual(true);
//           setUnsavedChanges(component);
//           resetBtn = component.find('.resetBtn');
//           expect(resetBtn.props().disabled).toEqual(false);
//         });
//         test('should call reset function on reset btn click', () => {
//           setUnsavedChanges(component);
//           const resetBtn = component.find('.resetBtn');
//           resetBtn.simulate('click');
//           expect(resetData).toHaveBeenCalledWith();
//         });
//       });
//       describe('Deleting rows', () => {
//         test('should delete a row from the data when we click the delete btn', () => {
//           const dataTableUi = component.find(DataTableUi);
//           const rowId = 'rowid';
//           const rowIndex = 3;
//           dataTableUi.props().deleteRow(rowId, rowIndex);
//           expect(handleDeleteRow).toHaveBeenCalledWith(rowId, rowIndex);
//         });
//       });

//       describe('Return totals data', () => {
//         test('should pass totals data to updateTotalsFn ', () => {
//           expect(updateTotals.mock.calls[0]).toEqual();
//         });
//       });
//     });
//     describe('sorting', () => {
//       test('should update sortby when selected from column header', () => {
//         useDataManager.mockClear();
//         const tableUI = component.find(DataTableUi);
//         const headingToSortBy = demoHeadingsData[0].uid;
//         tableUI.props().updateSortBy(headingToSortBy);
//         expect(useDataManager.mock.calls[0][0].sortBy).toEqual({
//           heading: headingToSortBy,
//           direction: 1,
//         });
//       });
//     });
//     describe('Selecting', () => {
//       test.skip('should return selection to onSelectionChange when called from selection hook', () => {
//         expect(onSelectionChange).not.toHaveBeenCalled();
//         expect(onSelectionChange).toHaveBeenCalledTimes(1);
//         expect(onSelectionChange).toHaveBeenCalledWith([]);
//       });
//       test.skip('should pass current selection to datatable ui', () => {
//         //
//       });
//     });
//   });
// });
