import React from 'react';
import { mount } from 'enzyme';
import DataTableCellText from './DataTableCellText';

const updateData = jest.fn();
const acceptValue = jest.fn();
const resetValue = jest.fn();
const defaultProps = {
  columnData: {
    type: 'text',
  },
  cellData: 'Hello World',
  updateData,
  acceptValue,
  resetValue,
  rowData: {},
};

describe('DataTableCellType - text', () => {
  let component;

  const setEditMode = (c) => {
    c.setProps({ editMode: true, focused: true });
  };
  describe('Unit Testing', () => {
    beforeEach(() => {
      updateData.mockClear();
      acceptValue.mockClear();
      resetValue.mockClear();
      component = mount(<DataTableCellText {...defaultProps} />);
    });
    test('should show the cell data', () => {
      const tree = component.debug();
      expect(tree).toMatchSnapshot();
    });
    test('should show input when in edit mode', () => {
      let cellInput = component.find('.cellInput-text');
      expect(cellInput).toBeTruthy();
      expect(cellInput.props().style.display).toEqual('none');
      setEditMode(component);
      cellInput = component.find('.cellInput-text');
      expect(cellInput.props().style.display).toEqual('block');
    });
    test('should update data on cell data change', () => {
      setEditMode(component);
      const cellInput = component.find('.cellInput-text');
      const newValue = 'newentry';
      cellInput.simulate('change', { target: { value: newValue } });
      expect(updateData).toHaveBeenCalledWith(newValue);
    });
    test('should accept value on unfocus', () => {
      setEditMode(component);
      const cellInput = component.find('.cellInput-text');
      cellInput.simulate('blur');
      expect(acceptValue).toHaveBeenCalledWith(defaultProps.cellData);
    });
    test('should accept value on key down enter', () => {
      setEditMode(component);
      const cellInput = component.find('.cellInput-text');
      cellInput.simulate('keyDown', { key: 'Enter' });
      expect(acceptValue).toHaveBeenCalledWith(defaultProps.cellData);
    });
    test('should call reset if user presses escape', () => {
      setEditMode(component);
      const cellInput = component.find('.cellInput-text');
      const newValue = 'newentry';
      cellInput.simulate('change', { target: { value: newValue } });
      expect(updateData).toHaveBeenCalledWith(newValue);
      cellInput.simulate('keyDown', { key: 'Escape' });
      expect(resetValue).toHaveBeenCalledWith();
    });
  });
});
