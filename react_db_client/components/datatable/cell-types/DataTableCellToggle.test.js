import React from 'react';
import { mount } from 'enzyme';
import { DataTableCellToggle } from './DataTableCellToggle';
import { ToggleBox } from '@samnbuk/react_db_client.components.form.form-components.toggle-box';


describe('DataTableCellType - text', () => {
  let component;
  const updateData = jest.fn();
  const acceptValue = jest.fn();
  const defaultProps = {
    columnData: {
      type: 'toggle',
    },
    cellData: true,
    updateData,
    acceptValue,
    rowData: {},
  };

  beforeEach(() => {
    updateData.mockClear();
    acceptValue.mockClear();
    component = mount(<DataTableCellToggle {...defaultProps} />);
  });

  test('should show the cell data', () => {
    const tree = component.debug();
    expect(tree).toMatchSnapshot();
  });

  test('should update value on change', () => {
    const toggleBox = component.find(ToggleBox);
    toggleBox.props().onChange(false);
    expect(updateData).not.toHaveBeenCalled();
    expect(acceptValue).toHaveBeenCalledWith(false);
  });
});
