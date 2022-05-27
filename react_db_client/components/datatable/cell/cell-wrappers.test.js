import '@samnbuk/react_db_client.testing.enzyme-setup';
import React from 'react';
import { mount } from 'enzyme';
import { DataTableCellText } from '@samnbuk/react_db_client.components.datatable.cell-types';
import { RightClickWrapper } from '@samnbuk/react_db_client.components.popup-menu';
import { DataTableDataCell } from './cell-wrappers';


describe('DataTableDataCell', () => {
  const defaultProps = {
    columnData: { type: 'text', readOnly: false, def: 'b', uid: 'a', label: 'a' },
    updateData: () => {},
    rowId: 'row1',
    columnId: 'col1',
    cellData: 'a',
    rowData: {
      uid: 'a',
      col1: 'a',
    },
    componentMap: {},
  };
  it('Renders', () => {
    mount(<DataTableDataCell {...defaultProps} />);
  });
  it('Matches Snapshot', () => {
    const component = mount(<DataTableDataCell {...defaultProps} />);
    const tree = component.debug();
    expect(tree).toMatchSnapshot();
  });
  describe('Unit Tests', () => {
    describe('Basic', () => {
      const component = mount(<DataTableDataCell {...defaultProps} />);
      it('Renders a text cell', () => {
        expect(component.find('.dataTableCellData')).toBeTruthy();
        expect(component.find(RightClickWrapper)).toBeTruthy();
        expect(component.find(DataTableCellText)).toBeTruthy();
      });
    });
    describe('Using custom field components', () => {
      test.skip('should allow passing custom field component', () => {
        //
      });
    });
  });
});
