import React from 'react';
import { mount, shallow } from 'enzyme';

import { demoHeadingsData } from '@samnbuk/react_db_client.components.datatable.extras';
import { DataTableTotals } from './DataTableTotals';
import {
  DataTableCellHoverWrap,
  DataTableDataCell,
} from '@samnbuk/react_db_client.components.datatable.cell';

const defaultProps = {
  headingsDataList: demoHeadingsData,
  columnWidths: demoHeadingsData.map(() => 10),
  totals: demoHeadingsData.map(() => 10),
  tableWidth: demoHeadingsData.reduce((acc, v) => acc + v),
  customFieldComponents: {},
};

describe('DataTableTotals', () => {
  beforeEach(() => {});
  test('Renders', () => {
    shallow(<DataTableTotals {...defaultProps} />);
  });
  describe('shallow renders', () => {
    test('Matches Snapshot', () => {
      const component = shallow(<DataTableTotals {...defaultProps} />);
      const tree = component.debug();
      expect(tree).toMatchSnapshot();
    });
  });
  describe('Unit tests', () => {
    let component;
    beforeEach(() => {
      component = mount(<DataTableTotals {...defaultProps} />);
    });

    describe('Showing Totals', () => {
      test('should show totals for columns with showTotals set to true', () => {
        const totalsRow = component.find(DataTableCellHoverWrap);
        const totalsCells = totalsRow.find(DataTableDataCell);
        expect(totalsCells).toHaveLength(demoHeadingsData.filter((h) => h.showTotals).length); // Not sure why there are double here
        expect(totalsCells.debug()).toMatchSnapshot();
      });
    });
  });
});
