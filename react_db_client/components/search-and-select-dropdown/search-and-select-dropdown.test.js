import '@samnbuk/react_db_client.testing.enzyme-setup';
import React from 'react';
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import toJson from 'enzyme-to-json';
import { createSerializer } from 'enzyme-to-json';
import { MockEs6, MockReactC } from '@samnbuk/react_db_client.testing.utils';
import {
  FilterObjectClass,
  filterTypes,
  comparisons,
} from '@react_db_client/constants.client-types';
import { useAsyncRequest } from '@react_db_client/async-hooks.use-async-request';
import { CustomSelectDropdown } from '@samnbuk/react_db_client.components.custom-select-dropdown';

import { SearchAndSelectDropdown } from './search-and-select-dropdown';
import { demoResultData } from './demo-data';
import { LoadingIcon } from './loading-icon';

jest.useFakeTimers();

jest.mock('@react_db_client/async-hooks.use-async-request', () => ({
  useAsyncRequest: jest.fn(),
}));
jest.mock('@samnbuk/react_db_client.components.custom-select-dropdown', () =>
  MockReactC('CustomSelectDropdown', ['CustomSelectDropdown'])
);
jest.mock('./loading-icon', () => MockReactC('LoadingIcon', ['LoadingIcon']));

const searchFunction = jest
  .fn()
  .mockImplementation(
    async () => new Promise((resolve) => setTimeout(() => resolve(demoResultData), 3000))
  );

const handleSelect = jest.fn();
const asyncSearchCall = jest.fn();

const returnFieldOnSelect = 'name';
const labelField = 'label';
const defaultProps = {
  searchFunction,
  handleSelect,
  labelField,
  debug: true,
  searchFieldTargetField: 'label',
  allowMultiple: false,
  selectionOverride: null,
  returnFieldOnSelect,
};

const defaultAsyncHookReturn = {
  reload: asyncSearchCall,
  loading: false,
  response: null,
};

const defaultAsyncHookReturnLoaded = {
  reload: asyncSearchCall,
  loading: false,
  response: demoResultData,
};


/* Helpers*/

const focusOnSearchInput = (c) => {
  const searchField = c.find('.searchField');
  searchField.simulate('focus');
  c.update();
  jest.runOnlyPendingTimers();
};

const modifySearchInput = (c, searchVal) => {
  const searchField = c.find('.searchField');
  searchField.simulate('change', { target: { value: searchVal } });
  c.update();
  jest.runOnlyPendingTimers();
};

const setLoaded = (c, results) => {
  useAsyncRequest.mockClear().mockReturnValue(defaultAsyncHookReturnLoaded);
  c.setProps();
  c.update();
  act(() => {
    useAsyncRequest.mock.calls[0][0].callback(results);
  });
  c.update();
};

const clickDopdownBtn = (c) => {
  const dropdownBtn = c.find('.dropdownBtn');
  dropdownBtn.simulate('click');
  c.update();
}

/* Tests */
describe('SearchAndSelectDropdown', () => {
  beforeEach(() => {
    setTimeout.mockClear();
    handleSelect.mockClear();
    asyncSearchCall.mockClear();
    useAsyncRequest.mockClear().mockReturnValue(defaultAsyncHookReturn);
  });
  test('Renders', () => {
    shallow(<SearchAndSelectDropdown {...defaultProps} />);
  });
  describe('shallow renders', () => {
    test('Matches Snapshot', () => {
      const component = shallow(<SearchAndSelectDropdown {...defaultProps} />);
      const tree = component.debug();
      expect(tree).toMatchSnapshot();
    });
  });
  describe('Unit tests', () => {
    let component;
    beforeEach(() => {
      component = mount(<SearchAndSelectDropdown {...defaultProps} />);
    });



    describe('defaults', () => {
      test('should not do anything when we focus on search field', () => {
        const searchField = component.find('.searchField');
        act(() => {
          searchField.simulate('focus');
        });
        component.update();
        expect(asyncSearchCall).not.toHaveBeenCalled();
      });

      test('should call async search fn when we modify the search input', () => {
        expect(asyncSearchCall).not.toHaveBeenCalled();
        const searchVal = 'searchVal';
        focusOnSearchInput(component);
        modifySearchInput(component, searchVal);
        expect(setTimeout).toHaveBeenCalledTimes(2);
        expect(asyncSearchCall).toHaveBeenCalledWith([
          [
            new FilterObjectClass({
              uid: 'search',
              field: 'label',
              value: searchVal,
              operator: comparisons.contains,
              type: filterTypes.text,
            }),
          ],
        ]);
      });

      test('should not call async search fn when we modify the search input to empty', () => {
        setTimeout.mockClear();
        expect(asyncSearchCall).not.toHaveBeenCalled();
        const searchVal = '';
        focusOnSearchInput(component);
        modifySearchInput(component, searchVal);
        jest.runOnlyPendingTimers();
        expect(asyncSearchCall).not.toHaveBeenCalled();
      });


      test('should set not loading when search input set to empty', () => {
        const loadingIcon = () => component.find(LoadingIcon);
        focusOnSearchInput(component);

        modifySearchInput(component, 'searchval');
        jest.runOnlyPendingTimers();
        expect(loadingIcon().props().isLoading).toEqual(true);

        modifySearchInput(component, '');
        jest.runOnlyPendingTimers();
        expect(loadingIcon().props().isLoading).toEqual(false);
      });

      test('should show results when we are focused on search field and results loaded', () => {
        const searchVal = 'searchVal';
        focusOnSearchInput(component);
        modifySearchInput(component, searchVal);
        setLoaded(component, demoResultData);
        component.update();
        jest.runOnlyPendingTimers();
        const customSelectDropdown = component.find(CustomSelectDropdown);
        expect(customSelectDropdown.props().isOpen).toEqual(true);
        expect(customSelectDropdown.props().options).toEqual(
          demoResultData.map((r) => ({ label: r.label, uid: r.uid }))
        );
      });

      test('should set search field to input value', () => {
        component = mount(
          <SearchAndSelectDropdown {...defaultProps} intitialValue={demoResultData[0].label} />
        );
        const searchField = component.find('.searchField');
        expect(searchField.props().value).toEqual(demoResultData[0].label);
      });
    });
    describe('Allow empty search', () => {
      beforeEach(() => {
        component = mount(
          <SearchAndSelectDropdown {...defaultProps} searchValue="" allowEmptySearch />
        );
        jest.runOnlyPendingTimers()
      });

      test('should still not call search function before focused', () => {
        asyncSearchCall.mockClear()
        expect(asyncSearchCall).not.toHaveBeenCalled();
      });

      test('should call async search fn when we modify the search input with empty value', () => {
        focusOnSearchInput(component);
        expect(asyncSearchCall).toHaveBeenCalledWith([[]]);
      });
      test('should call async search func when input is set to empty', () => {
        focusOnSearchInput(component);
        modifySearchInput(component, 'searchVal');
        asyncSearchCall.mockClear();

        modifySearchInput(component, '');
        expect(asyncSearchCall).toHaveBeenCalledWith([[]]);
      });
    });
    describe('Dropdown Btn', () => {
      beforeEach(() => {
        component = mount(
          <SearchAndSelectDropdown {...defaultProps} searchValue="" allowEmptySearch/>
        );
      });

      test('should call async search fn when click dropdown btn', () => {
        jest.runOnlyPendingTimers()
        expect(asyncSearchCall).not.toHaveBeenCalled();
        clickDopdownBtn(component);
        component.update();
        jest.runOnlyPendingTimers()
        expect(asyncSearchCall).toHaveBeenCalledWith([[]]);
      });
    });
    describe('Selection', () => {
      const selectedItem = demoResultData[0];
      const searchVal = 'searchVal';
      beforeEach(() => {
        focusOnSearchInput(component);
        modifySearchInput(component, searchVal);
        setLoaded(component, demoResultData);
      });
      test('should call handleSelect when an item is selected from the customSelectDropdown', async () => {
        const customSelectDropdown = component.find(CustomSelectDropdown);
        act(() => {
          customSelectDropdown.props().handleSelect(selectedItem.uid);
        });
        expect(handleSelect).toHaveBeenCalledWith(selectedItem.uid, selectedItem);
      });
      test('should hide results dropdown after item selected', () => {
        let customSelectDropdown = component.find(CustomSelectDropdown);
        expect(customSelectDropdown.props().isOpen).toEqual(true);
        act(() => {
          customSelectDropdown.props().handleSelect(selectedItem.uid);
        });
        component.update();
        customSelectDropdown = component.find(CustomSelectDropdown);
        expect(customSelectDropdown.props().isOpen).toEqual(false);
      });
      test('should set the search value to match the selected items label field', () => {
        let searchField = component.find('.searchField');
        expect(searchField.props().value).toEqual(searchVal);
        const customSelectDropdown = component.find(CustomSelectDropdown);
        act(() => {
          customSelectDropdown.props().handleSelect(selectedItem.uid);
        });
        component.update();
        searchField = component.find('.searchField');
        expect(searchField.props().value).toEqual(selectedItem.label);
      });
    });
    /* Multi select now managed by parent component */
    // describe('Multi select', () => {
    //   const selectedItem = demoResultData[0];
    //   beforeEach(() => {
    //     useSelectionManager.mockClear().mockReturnValue({
    //       ...defaultSelectionManagerReturn,
    //       currentSelection: [demoResultData[0].uid, demoResultData[1].uid],
    //       currentSelectionLabels: [demoResultData[0].label, demoResultData[1].label],
    //     });
    //     component = mount(
    //       <SearchAndSelectDropdown {...{ ...defaultProps, allowMultiple: true }} />
    //     );
    //     useAsyncRequest.mockClear().mockReturnValue(defaultAsyncHookReturnLoaded);
    //     component.setProps();
    //     const searchField = component.find('.searchField');
    //     searchField.simulate('keyDown', { key: 'Enter' });
    //     component.update();
    //   });
    //   test('should call handleItemSelect with list when an item is selected from the customSelectDropdown', () => {
    //     const customSelectDropdown = component.find(CustomSelectDropdown);
    //     customSelectDropdown.props().handleSelect(selectedItem.uid);
    //     expect(handleItemSelect).toHaveBeenCalledWith(selectedItem.uid);
    //   });
    //   test('should show selected items buttons next to search bar', () => {
    //     const selectedItemsWrap = component.find('.selectedItemsWrap');
    //     const selectedItemsButtons = selectedItemsWrap.find('.searchSelectedItem');
    //     expect(selectedItemsButtons.length).toEqual(2);
    //   });
    //   test('should use item label not id', () => {
    //     const selectedItemsWrap = component.find('.selectedItemsWrap');
    //     const firstSelectedItemsButtons = selectedItemsWrap.find('.searchSelectedItem').first();
    //     expect(firstSelectedItemsButtons.text()).toEqual(demoResultData[0].label);
    //   });
    //   test('should call handle item select with uid when selected button pressed', () => {
    //     const selectedItemsWrap = component.find('.selectedItemsWrap');
    //     const firstSelectedItemsButtons = selectedItemsWrap.find('.searchSelectedItem').first();
    //     firstSelectedItemsButtons.simulate('click');
    //     component.update();
    //     expect(handleItemSelect).toHaveBeenCalledWith(demoResultData[0].uid);
    //   });
    // });
  });
});
