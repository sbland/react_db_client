import React from 'react';
import { mount } from 'enzyme';
// import { MockReactC } from '../../Helpers/testing';

import { CustomSelectDropdown } from './custom-select-dropdown';
import { DropDownItem } from './drop-down-item';

// jest.mock('./DropDownItem', () => MockReactC('DropDownItem'));

const DEMO_OPTIONS = [
  { uid: 1, label: '01' },
  { uid: 2, label: '02' },
  { uid: 3, label: '03' },
  { uid: 4, label: '04' },
  { uid: 5, label: '05' },
  { uid: 6, label: '06' },
  { uid: 7, label: '07' },
];

const handleSelect = jest.fn();

const defaultProps = {
  options: DEMO_OPTIONS,
  handleSelect,
  isOpen: true,
  handleClose: () => {},
  firstItemRef: {}, // TODO: Set this correctly
};

describe('CustomSelectDropdown', () => {
  beforeEach(() => {
    handleSelect.mockClear();
  });
  describe('Functional Testing', () => {
    let component;
    beforeAll(() => {
      component = mount(<CustomSelectDropdown {...defaultProps} />);
    });
    test('Can access drop down item', () => {
      const item = component.find(DropDownItem).first();
      const itemUid = item.props().uid;
      item.find('.itemBtn').simulate('click');
      expect(handleSelect).toHaveBeenCalledWith(itemUid);
    });
  });
});
