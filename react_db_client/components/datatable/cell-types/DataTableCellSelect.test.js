import React from 'react';
import { mount } from 'enzyme';
import { DataTableCellSelect } from './DataTableCellSelect';
import { CustomSelectDropdown } from '@react_db_client/components.custom-select-dropdown';

const updateData = jest.fn();
const acceptValue = jest.fn();
const resetValue = jest.fn();

const columnData = {
  type: 'select',
  options: [
    { uid: 'a', label: 'A' },
    { uid: 'b', label: 'B' },
    { uid: 'c', label: 'C' },
  ],
};

const defaultProps = {
  columnData,
  cellData: 'a',
  updateData,
  acceptValue,
  resetValue,
  rowData: {},
  editMode: false,
  focused: false,
};

// TODO: Reimplement select cell
describe('DataTableCellType - text', () => {
  let component;

  beforeEach(() => {
    updateData.mockClear();
    acceptValue.mockClear();
    resetValue.mockClear();
    component = mount(<DataTableCellSelect {...defaultProps} />);
  });

  const setEditMode = (c) => {
    c.setProps({ editMode: true, focused: true });
    c.update();
  };
  describe('Render', () => {
    test('should match snapshot', () => {
      const tree = component.debug();
      expect(tree).toMatchSnapshot();
    });
  });

  test('should show the cell data', () => {
    const displayCellData = component.find('.displayCellData');
    expect(displayCellData.text()).toEqual(columnData.options[0].label);
  });

  test('should open the selection dropdown when we enable editmode and is focused', () => {
    let selectDropdown = component.find(CustomSelectDropdown);
    expect(selectDropdown.props().isOpen).toEqual(false);
    setEditMode(component);
    selectDropdown = component.find(CustomSelectDropdown);
    expect(selectDropdown.props().isOpen).toEqual(true);
  });

  test.skip('should focus on first item in dropdown when in edit mode and is focused', () => {
    setEditMode(component);
    const selectDropdown = component.find(CustomSelectDropdown);
    expect(selectDropdown.props().isOpen).toEqual(true);
    const focusedElement = document.activeElement;
    expect(selectDropdown.getDOMNode()).toBe(focusedElement);
  });

  test.skip('should close selection dropdown on value accept', () => {
    setEditMode(component);
    let selectDropdown = component.find(CustomSelectDropdown);
    selectDropdown.props().handleSelect(columnData.options[0].uid);
    selectDropdown = component.find(CustomSelectDropdown);
    expect(selectDropdown.props().isOpen).toEqual(false);
  });

  // test('should unhide cell input when clicking the edit btn', () => {
  //   let cellInput = component.find(inputClassname);
  //   expect(cellInput).toBeTruthy();
  //   expect(cellInput.props().style.display).toEqual('none');
  //   const editBtn = component.find('.editBtn');
  //   editBtn.simulate('click');
  //   cellInput = component.find(inputClassname);
  //   expect(cellInput.props().style.display).toEqual('block');
  // });
  // test('should update data on cell data change', () => {
  //   setEditMode(component);
  //   const cellInput = component.find(inputClassname);
  //   const newValue = 'newentry';
  //   cellInput.simulate('change', { target: { value: newValue } });
  //   expect(updateData).toHaveBeenCalledWith(newValue);
  // });
  // test('should accept value on unfocus', () => {
  //   setEditMode(component);
  //   const cellInput = component.find(inputClassname);
  //   cellInput.simulate('blur');
  //   expect(acceptValue).toHaveBeenCalledWith(defaultProps.cellData);
  // });
  // test('should accept value on key down enter', () => {
  //   setEditMode(component);
  //   const cellInput = component.find(inputClassname);
  //   cellInput.simulate('keyDown', { key: 'Enter' });
  //   expect(acceptValue).toHaveBeenCalledWith(defaultProps.cellData);
  // });
  // test('should reset value to initial value if user presses escape', () => {
  //   setEditMode(component);
  //   const cellInput = component.find(inputClassname);
  //   const newValue = 'newentry';
  //   cellInput.simulate('change', { target: { value: newValue } });
  //   expect(updateData).toHaveBeenCalledWith(newValue);
  //   cellInput.simulate('keyDown', { key: 'Escape' });
  //   expect(resetValue).toHaveBeenCalledWith();
  // });
});
