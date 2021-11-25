import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { BubbleSelector } from './bubble-selector';

describe('BubbleSelector', () => {
  it('Renders', () => {
    shallow(
      <BubbleSelector
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
      <BubbleSelector
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
      <BubbleSelector
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
    it('calls update selection with item removed when selected item is clicked', () => {
      const selectedItemBtn = bubbleSelector.find('.selected').first();
      selectedItemBtn.simulate('click');
      expect(updateActiveSelection).toHaveBeenCalled();
      expect(updateActiveSelection).toHaveBeenCalledWith(['b'], 'remove', 'a');
      updateActiveSelection.mockClear();
    });
    it('calls update selection with item added when non-selected item is clicked', () => {
      const selectedItemBtn = bubbleSelector.find('.notSelected').first();
      selectedItemBtn.simulate('click');
      expect(updateActiveSelection).toHaveBeenCalled();
      expect(updateActiveSelection).toHaveBeenCalledWith(['a', 'b', 'c'], 'add', 'c');
      updateActiveSelection.mockClear();
    });
  });
  describe('Adding custom entry', () => {
    const updateActiveSelection = jest.fn();
    const bubbleSelector = mount(
      <BubbleSelector
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
});
