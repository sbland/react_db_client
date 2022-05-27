import '@samnbuk/react_db_client.testing.enzyme-setup';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { MultiSelectDropdown, MultiSelectDropdownItem } from './multi-select-dropdown';
import * as compositions from './multi-select-dropdown.composition';

describe('MultiSelectDropdown', () => {
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, () => {
        mount(<Composition />);
      });
    });
  });

  it('Renders', () => {
    shallow(
      <MultiSelectDropdown
        activeSelection={['a', 'b']}
        options={[
          { uid: 'a', label: 'a' },
          { uid: 'b', label: 'b' },
          { uid: 'c', label: 'c' },
          { uid: 'd', label: 'd' },
        ]}
        updateActiveSelection={() => {}}
      />
    );
  });
  it('Matches Snapshot', () => {
    const component = shallow(
      <MultiSelectDropdown
        activeSelection={['a', 'b']}
        options={[
          { uid: 'a', label: 'a' },
          { uid: 'b', label: 'b' },
          { uid: 'c', label: 'c' },
          { uid: 'd', label: 'd' },
        ]}
        updateActiveSelection={() => {}}
      />
    );
    const tree = component.debug();
    expect(tree).toMatchSnapshot();
  });
  describe('selecting', () => {
    const updateActiveSelection = jest.fn();
    const bubbleSelector = mount(
      <MultiSelectDropdown
        activeSelection={['a', 'b']}
        options={[
          { uid: 'a', label: 'a' },
          { uid: 'b', label: 'b' },
          { uid: 'c', label: 'c' },
          { uid: 'd', label: 'd' },
        ]}
        updateActiveSelection={updateActiveSelection}
      />
    );
    it('highlights selected', () => {
      expect(bubbleSelector.find('.selected').length).toEqual(2);
    });
    // TODO: Below does not work as unselected are hidden!
    // it('calls update selection with item added when non-selected item is clicked', () => {
    //   console.log(bubbleSelector.debug());
    //   const selectedItemBtn = bubbleSelector.find('.notSelected').first();
    //   selectedItemBtn.simulate('click');
    //   expect(updateActiveSelection).toHaveBeenCalled();
    //   expect(updateActiveSelection).toHaveBeenCalledWith(['a', 'b', 'c']);
    //   updateActiveSelection.mockClear();
    // });
    it('calls update selection with item removed when selected item is clicked', () => {
      const selectedItemBtn = bubbleSelector.find('.selected').first();
      selectedItemBtn.simulate('click');
      expect(updateActiveSelection).toHaveBeenCalled();
      expect(updateActiveSelection).toHaveBeenCalledWith(['b']);
      updateActiveSelection.mockClear();
    });
  });
  describe('Adding custom entry', () => {
    const updateActiveSelection = jest.fn();
    const bubbleSelector = mount(
      <MultiSelectDropdown
        activeSelection={['a', 'b', 'e']}
        options={[
          { uid: 'a', label: 'a' },
          { uid: 'b', label: 'b' },
          { uid: 'c', label: 'c' },
          { uid: 'd', label: 'd' },
        ]}
        updateActiveSelection={updateActiveSelection}
      />
    );
    it('allows selections outside of option set', () => {
      expect(bubbleSelector.find('.selected').length).toEqual(3);
    });
    // it('adds a selection on entering into text field and pressing enter', () => {
    //   // const textField =
    // });
  });
  describe('sorts selection', () => {
    const updateActiveSelection = jest.fn();
    const multiSelectDropDown = mount(
      <MultiSelectDropdown
        activeSelection={['a', 'c']}
        options={[
          { uid: 'a', label: 'a' },
          { uid: 'b', label: 'b' },
          { uid: 'c', label: 'c' },
          { uid: 'd', label: 'd' },
        ]}
        updateActiveSelection={updateActiveSelection}
      />
    );
    it('allows selections outside of option set', () => {
      const dropDownBtn = multiSelectDropDown.find('.filterBtn');
      dropDownBtn.simulate('click');
      const multiSelectDropdown_menu = multiSelectDropDown.find('.multiSelectDropdown_menu');
      const item = multiSelectDropdown_menu.find(MultiSelectDropdownItem);
      const btn = item.at(0).find('button');
      btn.simulate('click');
      expect(updateActiveSelection).toHaveBeenCalledWith(['a', 'b', 'c']);
    });
  });
});
