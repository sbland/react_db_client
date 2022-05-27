import React from 'react';
import { mount } from 'enzyme';
import DataTableCellNumber from './DataTableCellNumber';

describe('DataTableCellType - number', () => {
  let component;
  const updateData = jest.fn();
  const acceptValue = jest.fn();
  const resetValue = jest.fn();
  const inputClassName = '.cellInput-number';

  const defaultProps = {
    columnData: {
      defaultValue: 3.01,
      readOnly: false,
      min: 0,
      max: 30.3,
      step: 0.1,
      type: 'number',
    },
    cellData: 28.345,
    updateData,
    acceptValue,
    resetValue,
    rowData: {},
  };

  beforeEach(() => {
    updateData.mockClear();
    acceptValue.mockClear();
    resetValue.mockClear();
    component = mount(<DataTableCellNumber {...defaultProps} />);
  });

  const setEditMode = (c) => {
    c.setProps({ editMode: true, focused: true });
  };

  test('should show the cell data', () => {
    const tree = component.debug();
    expect(tree).toMatchSnapshot();
  });

  test('should unhide cell input when clicking the edit btn', () => {
    let cellInput = component.find('.cellInput-number');
    expect(cellInput.props().style.display).toEqual('none');
    setEditMode(component);
    cellInput = component.find('.cellInput-number');
    expect(cellInput.props().style.display).toEqual('block');
  });
  test('should update data on cell data change', () => {
    setEditMode(component);
    const cellInput = component.find(inputClassName);
    const newValue = 3;
    cellInput.simulate('change', { target: { value: newValue } });
    expect(updateData).toHaveBeenCalledWith(newValue);
  });
  test('should cap data to max on cell data change', () => {
    setEditMode(component);
    const cellInput = component.find(inputClassName);
    const newValue = defaultProps.columnData.max + 1;
    cellInput.simulate('change', { target: { value: newValue } });
    expect(updateData).toHaveBeenCalledWith(defaultProps.columnData.max);
  });
  test('should cap data to min on cell data change', () => {
    setEditMode(component);
    const cellInput = component.find(inputClassName);
    const newValue = defaultProps.columnData.min - 1;
    cellInput.simulate('change', { target: { value: newValue } });
    expect(updateData).toHaveBeenCalledWith(defaultProps.columnData.min);
  });
  test('should update value with empty if an invalid value is inputed', () => {
    setEditMode(component);
    const cellInput = component.find(inputClassName);
    const newValue = 'abc';
    cellInput.simulate('change', { target: { value: newValue } });
    expect(updateData).toHaveBeenCalledWith('');
  });
  test('should accept value on unfocus', () => {
    setEditMode(component);
    const cellInput = component.find(inputClassName);
    cellInput.simulate('blur');
    expect(acceptValue).toHaveBeenCalledWith(defaultProps.cellData);
  });
  test('should accept value on key down enter', () => {
    setEditMode(component);
    const cellInput = component.find(inputClassName);
    cellInput.simulate('keyDown', { key: 'Enter' });
    expect(acceptValue).toHaveBeenCalledWith(defaultProps.cellData);
  });
  test('should reset value to initial value if user presses escape', () => {
    setEditMode(component);
    const cellInput = component.find(inputClassName);
    const newValue = 8;
    cellInput.simulate('change', { target: { value: newValue } });
    expect(updateData).toHaveBeenCalledWith(newValue);
    cellInput.simulate('keyDown', { key: 'Escape' });
    expect(resetValue).toHaveBeenCalledWith();
  });
  // test('should update initial value when accepting value', () => {
  //   setEditMode(component);
  //   const cellInput = component.find(inputClassName);
  //   const newValue = 8;
  //   cellInput.simulate('change', { target: { value: newValue } });
  //   expect(updateData).toHaveBeenCalledWith(newValue);
  //   component.setProps({ cellData: newValue });
  //   cellInput.simulate('keyDown', { key: 'Enter' });
  //   expect(acceptValue).toHaveBeenCalledWith(newValue);
  //   acceptValue.mockClear();
  //   cellInput.simulate('keyDown', { key: 'Escape' });
  //   expect(acceptValue).toHaveBeenCalledWith(newValue);
  // });

  test('should show the cell data - to 1 decimal places', () => {
    component.setProps({
      columnData: {
        ...defaultProps.columnData,
        step: 0.1,
      },
    });
    const displayText = component.find('.dataTableCellData_text');
    expect(displayText.text()).toEqual('28.3');
  });
  test('should show the cell data - to 0 decimal places', () => {
    component.setProps({
      columnData: {
        ...defaultProps.columnData,
        step: 1,
      },
    });
    const displayText = component.find('.dataTableCellData_text');
    expect(displayText.text()).toEqual('28');
  });
});
