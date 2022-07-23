import '@samnbuk/react_db_client.testing.enzyme-setup';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MockReactC } from '@react_db_client/testing.utils';

import { CustomSelectDropdown } from './custom-select-dropdown';
import { DropDownItem } from './drop-down-item';

jest.mock('./drop-down-item', () => MockReactC('DropDownItem', ['DropDownItem']));

jest.mock('react', () => {
  const originReact = jest.requireActual('react');
  let i = 0;
  return {
    ...originReact,
    useRef: jest.fn().mockImplementation(() => {
      i += 1;
      if (i % 2 === 0)
        return { current: [{ focus: () => {} }, { focus: () => {} }, { focus: () => {} }] };
      return { current: null };
    }),
  };
});

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
const handleClose = jest.fn();
const goBackToSearchField = jest.fn();

const defaultProps = {
  options: DEMO_OPTIONS,
  handleSelect,
  isOpen: true,
  handleClose,
  firstItemRef: {}, // TODO: Set this correctly
  goBackToSearchField,
};

describe('CustomSelectDropdown', () => {
  beforeEach(() => {
    handleSelect.mockClear();
    handleClose.mockClear();
    goBackToSearchField.mockClear();
  });
  it('Renders', () => {
    shallow(<CustomSelectDropdown {...defaultProps} />);
  });
  it('Matches Snapshot', () => {
    const component = shallow(<CustomSelectDropdown {...defaultProps} />);
    const tree = component.debug();
    expect(tree).toMatchSnapshot();
  });
  describe('Unit Testing', () => {
    let component;
    beforeEach(() => {
      component = mount(<CustomSelectDropdown {...defaultProps} />);
    });

    describe('showing items', () => {
      test('should show a list of dropdown items', () => {
        expect(component.find(DropDownItem).length).toEqual(DEMO_OPTIONS.length);
      });
    });
    describe('selecting items', () => {
      test('should call handle select when one of the dropdown items is selected', () => {
        const item = component.find(DropDownItem).first();
        const itemUid = item.props().uid;
        item.props().handleSelect(itemUid);
        expect(handleSelect).toHaveBeenCalledWith(itemUid);
      });
    });
    describe('Navigating items', () => {
      test('should pass is focused prop to drop down item', () => {
        const item = component.find(DropDownItem).first();
        expect(item.props().isFocused).toEqual(true);
      });

      test('should allow scrolling through items with the up and down arrows', () => {
        let firstItem = component.find(DropDownItem).first();
        let secondItem = component.find(DropDownItem).at(1);
        expect(firstItem.props().isFocused).toEqual(true);
        expect(secondItem.props().isFocused).toEqual(false);
        act(() => {
          firstItem.props().handleKeyDown({ key: 'ArrowDown', preventDefault: () => {} });
        });
        component.update();
        firstItem = component.find(DropDownItem).first();
        secondItem = component.find(DropDownItem).at(1);
        expect(firstItem.props().isFocused).toEqual(false);
        expect(secondItem.props().isFocused).toEqual(true);
      });
    });
  });
});
