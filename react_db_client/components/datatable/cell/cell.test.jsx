import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { sleep } from '@samnbuk/react_db_client.helpers.testing';
import { Cell } from './cell';
import { defaultComponentMap } from '@samnbuk/react_db_client.components.datatable.components';
import { DataTableDataCell } from './cell-wrappers';
import { DataTableCellText } from '@samnbuk/react_db_client.components.datatable.cell-types';
import {
  demoHeadingsData,
  demoTableData,
} from '@samnbuk/react_db_client.components.datatable.extras';
import {
  DataTableContext,
  dataTableDefaultConfig,
} from '@samnbuk/react_db_client.components.datatable.logic';

import {
  CustomSelectDropdown,
  DropdownItem,
} from '@samnbuk/react_db_client.components.custom-select-dropdown';
import { act } from 'react-dom/test-utils';

const DEMO_TABLE_DATA = Object.values(demoTableData);

const handleValueAccept = jest.fn();
const handleValueChange = jest.fn();
const handleValueReset = jest.fn();
// const handleDeleteRow = jest.fn();
const handleMoveFocusToTargetCell = jest.fn();
// const handleEditPanelBtnClick = jest.fn();
// const handleAddToSelection = jest.fn();
// const handleRemoveFromSelection = jest.fn();
const setNavigationMode = jest.fn();

const ROW_INDEX = 1;
const COLUMN_INDEX = 1;
const defaultProps = {
  columnIndex: COLUMN_INDEX,
  rowIndex: ROW_INDEX,
  style: {},
  className: '',
  tableData: DEMO_TABLE_DATA,
  headingsData: demoHeadingsData,
  methods: {
    handleValueAccept,
    handleValueChange,
    handleValueReset,
    handleMoveFocusToTargetCell,
    setNavigationMode,
  },
  currentFocusedRow: 0,
  currentFocusedColumn: 0,
  navigationMode: true,
  componentMap: defaultComponentMap(),
};

describe('DatatableCell', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe('Renders', () => {
    test('Ok', () => {
      mount(<Cell {...defaultProps} />);
    });
    test('Matches Snapshot', () => {
      const component = mount(
        <DataTableContext.Provider value={dataTableDefaultConfig}>
          <Cell {...defaultProps} />
        </DataTableContext.Provider>
      );
      const tree = toJson(component);
      expect(tree).toMatchSnapshot();
    });
  });
  describe('Unit tests', () => {
    describe('Navigation', () => {
      /* Helper Utils */
      const getComponent = ({
        isFocused = true,
        navigationMode = true,
        rowIndex = ROW_INDEX,
        columnIndex = COLUMN_INDEX,
        override = {},
      } = {}) => {
        document.body.innerHTML = `
            <div id="wrap"></div>
    `;
        const wrap = document.getElementById('wrap');
        const props = isFocused
          ? {
              ...defaultProps,
              rowIndex,
              columnIndex,
              ...defaultProps.data,
              currentFocusedColumn: columnIndex,
              currentFocusedRow: rowIndex,
              navigationMode,
              ...override,
            }
          : { ...defaultProps, rowIndex, columnIndex };
        return mount(
          <DataTableContext.Provider value={dataTableDefaultConfig}>
            <Cell {...props} />
          </DataTableContext.Provider>,
          { attachTo: wrap }
        );
      };

      const pressKeyOnNavBtn = (c, key) => {
        const navigationBtn = c.find('.navigationButton');
        navigationBtn.simulate('keyDown', { key });
        c.update();
      };

      const enterEditMode = (c) => {
        const navigationBtn = c.find('.navigationButton');
        navigationBtn.simulate('keyDown', { key: 'Enter' });
        c.setProps({ ...c.props(), navigationMode: false });
        c.update();
      };

      const resetCell = (c) => {
        const cell = c.find(DataTableDataCell);
        cell.props().resetValue();
        c.update();
      };

      const acceptCell = (c) => {
        const cell = c.find(DataTableDataCell);
        act(() => {
          cell.props().acceptValue('New Val');
        });
      };

      // const checkIsInNavigationMode = (c) => {
      //   const dataTableCellData = c.find(DataTableDataCell);
      //   return dataTableCellData.props().focused;
      // };

      const checkIsInEditMode = (c) => {
        const dataTableCellData = c.find(DataTableDataCell);
        return dataTableCellData.props().editMode;
      };

      /* Test */
      let component;
      beforeEach(() => {
        component = getComponent();
      });

      afterEach(() => {
        component && component.unmount();
      });

      test('should focus on the navigation button if this cell is focused', async () => {
        component = getComponent({ isFocused: true });
        const navigationBtn = component.find('.navigationButton');
        navigationBtn.getDOMNode();
        await sleep(1000);

        const focusedElement = document.activeElement;
        expect(navigationBtn.getDOMNode()).toBe(focusedElement);
      });

      test('should not focus on the navigation button if this cell is not focused', () => {
        component = getComponent({ isFocused: false });
        const navigationBtn = component.find('.navigationButton');
        const focusedElement = document.activeElement;
        expect(navigationBtn.getDOMNode()).not.toBe(focusedElement);
      });

      test('should turn off navigation mode when pressing enter on focused cell', () => {
        component = getComponent({ isFocused: true });
        pressKeyOnNavBtn(component, 'Enter');
        expect(setNavigationMode).toHaveBeenCalledWith(false);
      });

      test('should call cell hover on next cell if we use arrow keys', () => {
        pressKeyOnNavBtn(component, 'ArrowRight');
        expect(handleMoveFocusToTargetCell).toHaveBeenCalledWith(ROW_INDEX, COLUMN_INDEX + 1);
        handleMoveFocusToTargetCell.mockClear();
        pressKeyOnNavBtn(component, 'ArrowUp');
        expect(handleMoveFocusToTargetCell).toHaveBeenCalledWith(ROW_INDEX - 1, COLUMN_INDEX);
      });

      test('should turn on edit mode when pressing enter on focused cell', () => {
        component = getComponent({ isFocused: true, columnIndex: 2 });
        expect(checkIsInEditMode(component)).toEqual(false);
        enterEditMode(component);
        expect(checkIsInEditMode(component)).toEqual(true);
      });

      test('should go back to navigation mode if reset value', () => {
        component = getComponent({ isFocused: true, navigationMode: false });
        resetCell(component);
        expect(setNavigationMode).toHaveBeenCalledWith(true);
        expect(checkIsInEditMode(component)).toEqual(false);
      });

      describe.skip('navigate type specific edge cases', () => {
        describe('button cell type', () => {
          test('should call cell action when pressing enter on button cell', () => {
            const columnData = {
              uid: 'uid',
              label: 'UID',
              type: 'button',
              columnId: 1,
              action: jest.fn(),
            };

            component = getComponent({
              isFocused: true,
              navigationMode: true,
              rowIndex: 0,
              columnIndex: 1,
              override: {},
              headingsData: [columnData],
            });

            const initSnap = toJson(component);
            expect(checkIsInEditMode(component)).toEqual(false);
            enterEditMode(component);
            component.update();
            console.log(toJson(component));
            expect(initSnap).toMatchDiffSnapshot(toJson(component));
            // expect(checkIsInEditMode(component)).toEqual(false);
            expect(columnData.action).toHaveBeenCalledWith(
              DEMO_TABLE_DATA[0].uid,
              DEMO_TABLE_DATA[0][columnData.uid],
              DEMO_TABLE_DATA[0]
            );
          });
        });

        describe('bool cell type', () => {
          test('should toggle bool cell when pressing enter on bool cell', () => {
            const columnData = {
              uid: 'toggle',
              label: 'Toggle',
              type: 'toggle',
            };

            component = getComponent({
              isFocused: true,
              navigationMode: true,
              rowIndex: 0,
              columnIndex: 1,
              override: {},
              dataOverride: { headingsData: [columnData] },
            });
            enterEditMode(component);
            component.update();
            expect(checkIsInEditMode(component)).toEqual(false);
            expect(handleValueAccept).toHaveBeenCalledWith(
              !DEMO_TABLE_DATA[0][columnData.uid],
              DEMO_TABLE_DATA[0].uid,
              0,
              columnData.uid
            );
          });
        });

        describe('text-long cell type', () => {
          test('should focus on inner text area if enter pressed on nav button', () => {
            component = getComponent({
              isFocused: true,
              navigationMode: true,
              rowIndex: ROW_INDEX,
              columnIndex: 2,
            });
            pressKeyOnNavBtn(component, 'Enter');
            const textCell = component.find(DataTableCellText).find('.cellInput-text');
            const focusedElement = document.activeElement;
            expect(textCell.getDOMNode()).toBe(focusedElement);
          });
        });

        describe('select cell type', () => {
          const columnData = {
            uid: 'selectionField',
            label: 'UID',
            type: 'select',
            options: [{ uid: 'a', label: 'A' }],
          };
          const rowIndex = 0;

          const getSelComponent = () =>
            getComponent({
              isFocused: true,
              navigationMode: true,
              rowIndex,
              columnIndex: 1,
              override: {},
              headingsData: [columnData],
            });
          test('should open selection options automatically when pressing enter on focused cell', () => {
            component = getSelComponent();
            enterEditMode(component);
            component.update();
            const customDropDown = component.find(CustomSelectDropdown);
            expect(customDropDown.props().isOpen).toEqual(true);
          });

          test('should close selection options when a option is selected', () => {
            component = getSelComponent();
            const newVal = 'zzz';
            enterEditMode(component);
            let customDropDown = component.find(CustomSelectDropdown);
            customDropDown.props().handleSelect(newVal);
            expect(setNavigationMode).toHaveBeenCalledWith(true);
            component.update();
            expect(checkIsInEditMode(component)).toEqual(false);
            customDropDown = component.find(CustomSelectDropdown);
            expect(customDropDown.props().isOpen).toEqual(false);
            expect(handleValueAccept).toHaveBeenCalledWith(newVal, 'a', rowIndex, columnData.uid);
          });

          test('should accept value when accepting an option', () => {
            component = getSelComponent();
            enterEditMode(component);
            const newVal = 'zzz';
            const customDropDown = component.find(CustomSelectDropdown);
            const firstOption = customDropDown.find(DropdownItem).first();
            firstOption.props().handleSelect(newVal);
            expect(handleValueAccept).toHaveBeenCalledWith(newVal, 'a', rowIndex, columnData.uid);
          });

          test('should accept value when clicking an option', () => {
            component = getSelComponent();
            enterEditMode(component);
            const customDropDown = component.find(CustomSelectDropdown);
            const firstOption = customDropDown.find(DropdownItem).first().find('button');
            firstOption.simulate('click');
            component.update();
            expect(handleValueAccept).toHaveBeenCalledWith('a', 'a', rowIndex, columnData.uid);
          });
        });
      });

      test('should show and focus on navigation button and hide cell if reset value deep', () => {
        component = getComponent({
          isFocused: true,
          navigationMode: true,
          rowIndex: ROW_INDEX,
          columnIndex: 2,
        });
        enterEditMode(component);
        // pressKeyOnNavBtn(component, 'Enter');
        const textCell = component.find(DataTableCellText).find('.cellInput-textarea');
        textCell.simulate('keyDown', { key: 'Escape' });
        expect(setNavigationMode).toHaveBeenCalledWith(true);
        const focusedElement = document.activeElement;
        const navigationBtn = component.find('.navigationButton');
        expect(navigationBtn.getDOMNode()).toBe(focusedElement);
      });

      test('should show navigation button and hide cell if accept value', () => {
        component = getComponent({ isFocused: true });
        enterEditMode(component);
        acceptCell(component);
        expect(setNavigationMode).toHaveBeenCalledWith(false);
      });

      test('should go to edit mode and focus on the input of the cell if we click on it', () => {
        component = getComponent({ isFocused: true });
        const navigationBtn = component.find('.navigationButton');
        navigationBtn.simulate('click');
        expect(setNavigationMode).toHaveBeenCalledWith(false);
      });
    });
  });
});

// NOTE: Move this elsewhere as we no longer use btn column
// describe('Btns cell', () => {
//   test('Matches Snapshot', () => {
//     const props = {
//       ...defaultProps,
//       data: {
//         ...defaultProps.data,
//       },
//     };
//     const config = {
//       ...dataTableDefaultConfig,
//       allowEditRow: true,
//       allowRowDelete: true,
//       hasBtnsColumn: true,
//       allowSelection: true,
//     };
//     const component = mount(
//       <DataTableContext.Provider value={config}>
//         <Cell {...props} />
//       </DataTableContext.Provider>
//     );
//     const tree = component.debug();
//     expect(tree).toMatchSnapshot();
//   });
// });
