import '@samnbuk/react_db_client.testing.enzyme-setup';
import React from 'react';
import { mount } from 'enzyme';

import { SearchAndSelect } from './search-and-select';
import { demoResultData, demoHeadingsData } from './demo-data';
import { StyledSelectList, ListItem } from '@react_db_client/components.styled-select-list';
import { act } from 'react-dom/test-utils';

const searchFunction = jest.fn().mockImplementation(async () => demoResultData);

const handleSelect = jest.fn();

const defaultProps = {
  searchFunction,
  initialFilters: [],
  availableFilters: {},
  handleSelect,
  headings: demoHeadingsData,
};

describe('SearchAndSelect', () => {
  beforeEach(() => {
    handleSelect.mockClear();
  });
  describe('Functional tests', () => {
    let component;
    beforeEach(() => {
      component = mount(<SearchAndSelect {...defaultProps} />);
    });

    const selectItem = (c, i) => {
      const styledSelectList = component.find(StyledSelectList);
      const itemInList = styledSelectList.find('.styledList_itemBtn').at(i);

      itemInList.simulate('click');
      c.update();
    };
    describe('Multiple Selection auto update and live return', () => {
      beforeEach(async () => {
        await act(async () => {
          component = mount(
            <SearchAndSelect {...defaultProps} allowMultiple autoUpdate liveUpdate />
          );
          await new Promise((resolve) => setTimeout(resolve));
        });
      });
      test('should have called searchFn', () => {
        expect(searchFunction).toHaveBeenCalledWith([], 'uid', '', false);
      });

      test('should have passed results to styled select list', () => {
        component.update();
        const styledSelectList = component.find(StyledSelectList);
        expect(styledSelectList.props().listInput).toEqual(demoResultData);
      });

      test('should call handle select with updated selection when we select an item in the selection list', () => {
        component.update();
        handleSelect.mockClear();
        selectItem(component, 0);
        expect(handleSelect).toHaveBeenCalledWith([demoResultData[0].uid], [demoResultData[0]]);
      });

      test('should call handle select with multiple selections when clicked on multiple items', () => {
        component.update();
        handleSelect.mockClear();
        selectItem(component, 0);
        component.update();
        expect(handleSelect).toHaveBeenCalledWith([demoResultData[0].uid], [demoResultData[0]]);
        handleSelect.mockClear();
        selectItem(component, 1);
        component.update();
        expect(handleSelect).toHaveBeenCalledWith(
          [demoResultData[0].uid, demoResultData[1].uid],
          [demoResultData[0], demoResultData[1]]
        );
      });
    });
    describe('Selection', () => {
      beforeEach(async () => {
        await act(async () => {
            component = mount(
              <SearchAndSelect {...defaultProps} autoUpdate />
            );
            await new Promise((resolve) => setTimeout(resolve));
          });
      });

      const makeSelection = (c, uid) => {
        const styledSelectList = c.find(StyledSelectList);
        act(() => {
          styledSelectList.props().handleSelect(uid);
        });
        c.update();
      };
      const isSelected = (c, uid) => {
        const listItems = c.find(ListItem);
        const listItemToSelect = listItems.findWhere((n) => n.props().data?.uid === uid);
        return listItemToSelect.props().isSelected === true;
      };
      test('should allow selecting', () => {
        component.update();
        const { uid } = demoResultData[0];
        makeSelection(component, uid);
        expect(isSelected(component, uid)).toEqual(true);
        expect(handleSelect).toHaveBeenCalledWith(uid, demoResultData[0]);
      });
      test('should allow selecting', () => {
        component.setProps({ returnFieldOnSelect: 'name' });
        component.update();
        const { uid, name } = demoResultData[0];
        makeSelection(component, uid);
        expect(isSelected(component, uid)).toEqual(true);
        expect(handleSelect).toHaveBeenCalledWith(name, demoResultData[0]);
      });
    });
  });
});
