import React from 'react';
// import { mount } from 'enzyme';
// import { VariableSizeGrid as Grid } from 'react-window';
// import DataTableWrapper from './DataTableWrapper';
// import {
//   CustomField,
//   customFilter,
//   demoFiltersData,
//   demoHeadingsData,
//   demoHeadingsDataSimple,
//   demoTableDataSimple,
// } from './demoData';
// import DataTableUi from './DataTableUi';
// import { dataTableDefaultConfig } from './DataTableConfig/DataTableConfig';
// import FilterManager, { AddFilterButton } from '../FilterManager/FilterManager';
// import DataTableCellText from './CellTypes/DataTableCellText';
// import FilterObjectClass, { FilterObjectSimpleClass } from '../FilterManager/FilterObjectClass';
// import { DataTableDataCell } from './DataTableCell/CellWrappers';
// import comparisons from '../../GenericConstants/comparisons';
// import Cell from './DataTableCell/DataTableCell';
// import DataTableCellNumber from './CellTypes/DataTableCellNumber';
// import FilterNumber from '../FilterManager/FilterTypes/FilterNumber';
// import DataTableBottomMenu from './DataTableBottomMenu/DataTableBottomMenu';
// import { SAVE_ACTIONS } from './DataManager/DataManager';

// jest.mock('../ErrorBoundary/ErrorBoundary');
// // MODULE MOCKS
// // jest.mock('./DataTableUi', () => MockReactC('DataTableUi'));
// // jest.mock('./DataManager/DataManager', () => MockEs6('DataManager'));
// // jest.mock('./DataTableColumnManager/ColumnVisabilityManager', () =>
// //   MockEs6('ColumnVisabilityManager')
// // );

// // FUNCTION MOCKS
// const saveData = jest.fn();
// const updateTotals = jest.fn();
// const updatedDataHook = jest.fn();
// const onSelectionChange = jest.fn();
// // DEMO DATA
// const DEMO_TABLE_DATA = Object.values(demoTableDataSimple);

// const DEMO_CONFIG = { ...dataTableDefaultConfig, allowSelection: true };
// const DEMO_SORT_BY = { heading: 'uid', direction: 1, map: null };
// const DEMO_FILTERS = demoFiltersData;

// const DEMO_HEADINGS = demoHeadingsData;

// const customFieldComponents = {
//   custom: CustomField,
//   customeval: DataTableCellNumber,
// };
// const customFilters = {
//   custom: customFilter,
// };
// const customFiltersComponents = { custom: FilterNumber };

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

//   customFieldComponents,
//   customFilters,
//   customFiltersComponents,
//   maxTableHeight: 4000,
//   maxTableWidth: 4000,
// };

// const clearFilters = (c) => {
//   const filterManager = c.find(FilterManager);
//   filterManager.props().clearFilters();
//   c.update();
// };
// const addFilter = (c, rowIndex = 0) => {
//   const filterManager = c.find(FilterManager);
//   filterManager
//     .props()
//     .addFilter(new FilterObjectSimpleClass('uid', DEMO_TABLE_DATA[rowIndex].uid));
//   c.update();
// };
// const getRowCount = (c) => {
//   const datatableUi = c.find(DataTableUi);
//   return datatableUi.props().tableData.length;
// };

// describe('DataTableWrapper', () => {
//   beforeEach(() => {
//     saveData.mockClear();
//     onSelectionChange.mockClear();
//   });
//   describe('Functional tests', () => {
//     let component;
//     beforeEach(() => {
//       component = mount(<DataTableWrapper {...defaultProps} />);
//     });
//     describe('deleting rows', () => {
//       test.skip('should delete a row from the data when we click the delete btn', () => {
//         expect(false).toEqual(true);
//       });
//     });
//     describe('Autosaving', () => {
//       beforeEach(() => {
//         component = mount(<DataTableWrapper {...defaultProps} autoSave />);
//       });
//       test('should propogate changes to a cell up to the parent component', () => {
//         const textCell = component.find(DataTableCellText).first();
//         const cellInput = textCell.find('.cellInput-text');
//         const newCellValue = 'abc';
//         cellInput.simulate('change', { target: { value: newCellValue } });
//         cellInput.simulate('blur');
//         const newRowData = {
//           ...DEMO_TABLE_DATA[0],
//           name: newCellValue,
//         };
//         expect(saveData).toHaveBeenCalledWith(
//           [newRowData, ...DEMO_TABLE_DATA.slice(1)],
//           SAVE_ACTIONS.ROW_CHANGED,
//           newRowData,
//           newRowData.uid,
//           ['name']
//         );
//       });

//       test('should remove row and autosave when delete row button pressed', () => {
//         const deleteRowBtn = component.find('.rowDeleteBtn').first();
//         deleteRowBtn.simulate('click');
//         expect(saveData).toHaveBeenCalledWith(
//           DEMO_TABLE_DATA.slice(1),
//           SAVE_ACTIONS.ROW_DELETED,
//           null,
//           DEMO_TABLE_DATA[0].uid
//         );
//       });
//     });

//     describe('Filtering', () => {
//       test('should clear filters from filter manager', () => {
//         addFilter(component);
//         const initialRowCount = getRowCount(component);
//         expect(initialRowCount).toEqual(1);
//         clearFilters(component);
//         const clearedRowCount = getRowCount(component);
//         expect(clearedRowCount).toEqual(DEMO_TABLE_DATA.length);
//       });

//       test('should filter rows when we add a filter from filter manager', () => {
//         clearFilters(component);
//         const initialRowCount = getRowCount(component);
//         expect(initialRowCount).toEqual(DEMO_TABLE_DATA.length);
//         addFilter(component);
//         const filteredRowCount = getRowCount(component);
//         expect(filteredRowCount).toEqual(1);
//       });
//       test('should add correct filter data when adding new filter', () => {
//         const initialFilterData = component.find(FilterManager).props().filterData;
//         const addFilterButton = component.find(AddFilterButton).find('button');
//         addFilterButton.simulate('click');
//         component.update();
//         const updatedFilterData = component.find(FilterManager).props().filterData;
//         expect(updatedFilterData.length).toEqual(initialFilterData.length + 1);
//         expect(updatedFilterData[updatedFilterData.length - 1]).toEqual(
//           new FilterObjectClass({
//             field: 'uid',
//             type: 'button',
//             label: 'UID',
//             filterOptionId: 'uid',
//             value: '',
//             uid: expect.any(String),
//           })
//         );
//       });
//       test('should add correct filter data when updating filter', () => {
//         const fields = component.find(FilterManager).props().fieldsData;
//         const newFilterField = demoHeadingsData[3];
//         expect(fields[newFilterField.uid]).toEqual(newFilterField);

//         const initialFilterData = component.find(FilterManager).props().filterData;
//         const updateFilterSelect = component.find('.filterItem_filterFieldSelect').first();
//         updateFilterSelect.simulate('change', { target: { value: newFilterField.uid } });
//         component.update();
//         const updatedFilterData = component.find(FilterManager).props().filterData;
//         expect(updatedFilterData.length).toEqual(initialFilterData.length);
//         expect(updatedFilterData[0]).toEqual(
//           new FilterObjectClass({
//             field: newFilterField.uid,
//             type: newFilterField.type,
//             label: newFilterField.label,
//             operator: comparisons.equals,
//             filterOptionId: newFilterField.uid,
//             value: 0,
//             uid: expect.any(String),
//           })
//         );
//       });
//     });

//     describe('Row selecting', () => {
//       beforeEach(() => {
//         component = mount(
//           <DataTableWrapper
//             {...{ ...defaultProps, config: { ...DEMO_CONFIG, allowSelection: true } }}
//           />
//         );
//         clearFilters(component);
//         component.update();
//       });
//       const selectNthRow = (c, n) => {
//         const firstRowSelectionBox = c.find('.rowSelectionBox').at(n);
//         firstRowSelectionBox.simulate('change');
//         c.update();
//       };
//       const selectAll = (c) => {
//         const selectAllBtn = c.find('.selectAllBtn');
//         selectAllBtn.simulate('click');
//         c.update();
//       };

//       const clearSelection = (c) => {
//         const clearSelectionBtn = c.find('.clearSelectionBtn');
//         clearSelectionBtn.simulate('click');
//         c.update();
//       };
//       test('should pass current selection to row selection boxes', () => {
//         const rowSelectionBoxes = component.find('.rowSelectionBox');
//         expect(rowSelectionBoxes.everyWhere((node) => !node.props().checked)).toBeTruthy();
//         selectNthRow(component, 0);
//         const firstRowSelectionBox = component.find('.rowSelectionBox').first();
//         expect(firstRowSelectionBox.props().checked).toBeTruthy();
//       });

//       test('should call onSelectionChange when we select a row', () => {
//         expect(onSelectionChange).not.toHaveBeenCalled();
//         selectNthRow(component, 0);
//         expect(onSelectionChange).toHaveBeenCalledWith([DEMO_TABLE_DATA[0]]);
//       });
//       test('should maintain correct selection when filters change', () => {
//         selectNthRow(component, 2);
//         let rowSelectionBox = component.find('.rowSelectionBox').at(2);
//         expect(rowSelectionBox.props().checked).toBeTruthy();
//         let currentSelection = component.find(DataTableUi).props().currentSelectionIds;
//         expect(currentSelection).toEqual([DEMO_TABLE_DATA[2].uid]);

//         addFilter(component, 2);

//         currentSelection = component.find(DataTableUi).props().currentSelectionIds;
//         expect(currentSelection).toEqual([DEMO_TABLE_DATA[2].uid]);

//         rowSelectionBox = component.find('.rowSelectionBox').at(0);
//         expect(rowSelectionBox.props().checked).toBeTruthy();
//       });
//       test('should remove non visable rows from selection when filters change', () => {
//         selectAll(component);
//         onSelectionChange.mockClear();
//         addFilter(component, 0);
//         expect(onSelectionChange).toHaveBeenCalledWith([DEMO_TABLE_DATA[0]]);
//       });

//       test('should remove from selection when we click a selected row checkbox', () => {
//         selectNthRow(component, 0);
//         selectNthRow(component, 0);
//         const firstRowSelectionBox = component.find('.rowSelectionBox').first();
//         expect(firstRowSelectionBox.props().checked).toEqual(false);
//       });
//       test('should call onSelectionChange when we deselect a row', () => {
//         expect(onSelectionChange).not.toHaveBeenCalled();
//         selectNthRow(component, 0);
//         selectNthRow(component, 1);
//         onSelectionChange.mockClear();
//         selectNthRow(component, 0);
//         expect(onSelectionChange).toHaveBeenCalledWith([DEMO_TABLE_DATA[1]]);
//       });
//       test('should select all with select button', () => {
//         let rowSelectionBoxes = component.find('.rowSelectionBox');
//         expect(rowSelectionBoxes.everyWhere((node) => !node.props().checked)).toBeTruthy();
//         selectAll(component);
//         rowSelectionBoxes = component.find('.rowSelectionBox');
//         expect(rowSelectionBoxes.everyWhere((node) => node.props().checked)).toBeTruthy();
//       });
//       test('should call onSelectionChange with all data on selectAllBtn click', () => {
//         selectAll(component);
//         expect(onSelectionChange).toHaveBeenCalledWith(DEMO_TABLE_DATA);
//       });
//       test('should only select filtered items with select all button', () => {
//         addFilter(component, 2);
//         selectAll(component);
//         expect(onSelectionChange).toHaveBeenCalledWith(DEMO_TABLE_DATA.filter((d, i) => i === 2));
//       });
//       test('should clear selection on clearSelection btn click', () => {
//         selectAll(component);
//         onSelectionChange.mockClear();
//         clearSelection(component);
//         expect(onSelectionChange).toHaveBeenCalledWith([]);
//       });
//     });
//     describe('Cell Navigation', () => {
//       const pressKeyOnFocusedNavBtn = (c, key) => {
//         const navigationBtn = c.find('.navigationButton.focused');
//         navigationBtn.simulate('keyDown', { key });
//         c.update();
//       };
//       const getCurrentFocusedCell = (c) => {
//         const grid = c.find(Grid);
//         const col = grid.props().itemData.currentFocusedColumn;
//         const row = grid.props().itemData.currentFocusedRow;
//         return [col, row];
//       };

//       beforeEach(() => {
//         component = mount(
//           <DataTableWrapper
//             {...{
//               ...defaultProps,
//               config: { ...DEMO_CONFIG, allowSelection: true, hasBtnsColumn: false },
//             }}
//           />
//         );
//         clearFilters(component);
//         component.update();
//       });
//       test('should be able to move around cells with arrow keys', () => {
//         const [col, row] = getCurrentFocusedCell(component);
//         pressKeyOnFocusedNavBtn(component, 'ArrowRight');
//         const [colNext, rowNext] = getCurrentFocusedCell(component);
//         expect(row).toEqual(rowNext);
//         expect(col + 1).toEqual(colNext);
//       });

//       test('should be able to move around cells with arrow keys after deleting a row', () => {
//         const deleteRowBtn = component.find('.rowDeleteBtn').at(1);
//         deleteRowBtn.simulate('click');
//         const [col, row] = getCurrentFocusedCell(component);
//         pressKeyOnFocusedNavBtn(component, 'ArrowRight');
//         pressKeyOnFocusedNavBtn(component, 'ArrowDown');
//         const [colNext, rowNext] = getCurrentFocusedCell(component);
//         expect(row + 1).toEqual(rowNext);
//         expect(col + 1).toEqual(colNext);
//       });
//       test('should move to next row when navigating with arrow keys', () => {
//         const [, row] = getCurrentFocusedCell(component);
//         for (let index = 0; index < DEMO_HEADINGS.length; index += 1) {
//           pressKeyOnFocusedNavBtn(component, 'ArrowRight');
//         }
//         const [, rowNext] = getCurrentFocusedCell(component);
//         expect(rowNext).toEqual(row + 1);
//       });

//       test('should be able to enter cell edit mode with enter key', () => {
//         pressKeyOnFocusedNavBtn(component, 'ArrowRight');
//         pressKeyOnFocusedNavBtn(component, 'Enter');
//         const textCell = component.find(DataTableCellText).filterWhere((n) => n.props().focused);
//         expect(textCell.props().columnData.type).toEqual('text');
//         expect(textCell.props().editMode).toEqual(true);

//         const textCellInput = component
//           .find(DataTableDataCell)
//           .filterWhere((n) => n.props().focused)
//           .find('.cellInput-text');

//         const focusedElement = document.activeElement;
//         expect(textCellInput.getDOMNode()).toBe(focusedElement);
//       });

//       test('should be able to exit cell edit mode with escape key', () => {
//         pressKeyOnFocusedNavBtn(component, 'ArrowRight');
//         pressKeyOnFocusedNavBtn(component, 'Enter');
//         const textCell = component
//           .find(DataTableDataCell)
//           .filterWhere((n) => n.props().focused)
//           .find('.cellInput-text');
//         textCell.simulate('keyDown', { key: 'Escape' });

//         const navigationBtn = component.find('.navigationButton.focused');
//         const focusedElement = document.activeElement;
//         expect(navigationBtn.getDOMNode()).toBe(focusedElement);
//       });

//       test('should be able to exit cell edit mode with enter key', () => {
//         pressKeyOnFocusedNavBtn(component, 'ArrowRight');
//         pressKeyOnFocusedNavBtn(component, 'Enter');
//         const textCell = component
//           .find(DataTableDataCell)
//           .filterWhere((n) => n.props().focused)
//           .find('.cellInput-text');
//         textCell.simulate('keyDown', { key: 'Enter' });

//         const navigationBtn = component.find('.navigationButton.focused');
//         const focusedElement = document.activeElement;
//         expect(navigationBtn.getDOMNode()).toBe(focusedElement);
//       });

//       test('should be able to exit cell edit mode with enter key after changes', () => {
//         pressKeyOnFocusedNavBtn(component, 'ArrowRight');
//         pressKeyOnFocusedNavBtn(component, 'Enter');
//         const textCell = component
//           .find(DataTableDataCell)
//           .filterWhere((n) => n.props().focused)
//           .find('.cellInput-textarea');
//         textCell.simulate('change', { target: { value: 'a' } });
//         const textCellAfterEdit = component
//           .find(DataTableDataCell)
//           .filterWhere((n) => n.props().focused)
//           .find('.cellInput-textarea');
//         expect(textCellAfterEdit.props().value).toEqual('a');

//         textCell.simulate('keyDown', { key: 'Enter' });

//         const navigationBtn = component.find('.navigationButton.focused');
//         const focusedElement = document.activeElement;
//         expect(navigationBtn.getDOMNode()).toBe(focusedElement);
//       });
//     });
//     describe('Adding a new row', () => {
//       const DEMO_TABLE_DATA_SIMPLE = Object.values(demoTableDataSimple);
//       const DEMO_HEADINGS_SIMPLE = demoHeadingsDataSimple.filter((h) => h.uid !== 'uid');
//       beforeEach(() => {
//         component = mount(
//           <DataTableWrapper
//             {...defaultProps}
//             autoSave
//             data={DEMO_TABLE_DATA_SIMPLE}
//             headings={DEMO_HEADINGS_SIMPLE}
//           />
//         );
//       });
//       test('should add a new data row when we click the add row button', () => {
//         const addRowButton = component.find('.addRowBtn');
//         addRowButton.simulate('click');
//         component.update();
//         const newRowData = DEMO_HEADINGS_SIMPLE.reduce(
//           (acc, k) => ({ ...acc, [k.uid]: k.defaultValue }),
//           { uid: expect.any(String) }
//         );
//         expect(saveData).toHaveBeenCalledWith(
//           [...DEMO_TABLE_DATA_SIMPLE, newRowData],
//           SAVE_ACTIONS.ROW_ADDED,
//           newRowData,
//           newRowData.uid
//         );
//       });
//       test('should add a new row when we try to hover over row greater than row count', () => {
//         const cell = component.find(Cell).first();
//         const targetRow = 2;
//         cell.props().data.handleMoveFocusToTargetRow(targetRow, DEMO_HEADINGS_SIMPLE.length);
//         component.update();
//         const newRowData = DEMO_HEADINGS_SIMPLE.reduce(
//           (acc, k) => ({ ...acc, [k.uid]: k.defaultValue }),
//           { uid: expect.any(String) }
//         );
//         expect(saveData).toHaveBeenCalledWith(
//           [...DEMO_TABLE_DATA_SIMPLE, newRowData],
//           SAVE_ACTIONS.ROW_ADDED,
//           newRowData,
//           newRowData.uid
//         );
//       });
//     });
//     describe('evaluating cells', () => {
//       beforeEach(() => {
//         component = mount(<DataTableWrapper {...defaultProps} />);
//         component.setProps({
//           data: DEMO_TABLE_DATA.map((row) => ({ ...row, customfield: 2 })),
//         });
//         component.update();
//         component.update();
//       });
//       test('should evaluate number field', () => {
//         //
//       });
//       test('should evaluate custom eval field', () => {
//         const customField = () => component.find(CustomField).first();
//         // console.log(component.find(DataTableUi).debug());
//         expect(customField().exists()).toBeTruthy();
//         expect(customField().props().cellData).toEqual(2);
//         const customFieldEval = () =>
//           component
//             .find(DataTableCellNumber)
//             .filterWhere((c) => c.props().columnData.uid === 'customfieldeval')
//             .first();
//         expect(customFieldEval().exists()).toBeTruthy();
//         expect(customFieldEval().props().cellData).toEqual(2 + 1);
//         const newVal = 3;
//         customField().props().acceptValue(3);
//         component.update();
//         component.update();
//         component.update();
//         expect(customFieldEval().props().cellData).toEqual(newVal + 1);
//         const saveBtn = component.find(DataTableBottomMenu).props().handleSaveBtnClick;
//         saveBtn();
//         expect(saveData.mock.calls[0][0][0].customfield).toEqual(newVal);
//       });
//     });
//   });
// });
