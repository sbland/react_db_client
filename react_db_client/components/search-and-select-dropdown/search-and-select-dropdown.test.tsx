import '@samnbuk/react_db_client.testing.enzyme-setup';
import React from 'react';
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import ReactDOMServer from 'react-dom/server';
import { MockEs6, MockReactC } from '@react_db_client/testing.utils';
import {
  FilterObjectClass,
  filterTypes,
  comparisons,
} from '@react_db_client/constants.client-types';
import { CustomSelectDropdown } from '@react_db_client/components.custom-select-dropdown';

import {
  SearchAndSelectDropdown,
  ISearchAndSelectDropdownProps,
  IItem,
} from './search-and-select-dropdown';
import { demoResultData } from './demo-data';
import { LoadingIcon } from './loading-icon';

const setTimeoutMock = jest.spyOn(window, 'setTimeout');

jest.useFakeTimers('modern');
const runOnlyPendingTimers = async () =>
  await act(async () => {
    jest.runOnlyPendingTimers();
  });

jest.mock('@react_db_client/components.custom-select-dropdown', () =>
  MockReactC('CustomSelectDropdown', ['CustomSelectDropdown'])
);
jest.mock('./loading-icon', () => MockReactC('LoadingIcon', ['LoadingIcon']));

const searchFunction = jest
  .fn()
  .mockImplementation(
    async () => new Promise((resolve) => setTimeout(() => resolve(demoResultData), 3000))
  );

const handleSelect = jest.fn();

const labelField = 'label';

// type Item = Partial<typeof demoResultData[0]> & IItem;

const defaultProps = {
  searchFunction,
  handleSelect,
  initialValue: '',
  labelField,
  debug: true,
  searchFieldTargetField: 'label',
  searchFieldPlaceholder: "helloworld"
} as ISearchAndSelectDropdownProps<IItem>;
/* Helpers*/

const focusOnSearchInput = async (c) => {
  const searchField = c.find('.searchField');
  searchField.simulate('focus');
  c.update();
  await runOnlyPendingTimers();
};

const modifySearchInput = async (c, searchVal) => {
  const searchField = c.find('.searchField');
  searchField.simulate('change', { target: { value: searchVal } });
  await act(async () => {
    c.update();
    jest.runOnlyPendingTimers();
  });
};

const clickDopdownBtn = (c) => {
  const dropdownBtn = c.find('.dropdownBtn');
  dropdownBtn.simulate('click');
  c.update();
};

/* Tests */
describe('SearchAndSelectDropdown', () => {
  beforeEach(() => {
    setTimeoutMock.mockClear();
    handleSelect.mockClear();
    searchFunction.mockClear();
  });
  test('Renders', () => {
    shallow(<SearchAndSelectDropdown {...(defaultProps as ISearchAndSelectDropdownProps<IItem>)} />);
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
        expect(searchFunction).not.toHaveBeenCalled();
      });

      test('should call async search fn when we modify the search input', async () => {
        expect(searchFunction).not.toHaveBeenCalled();
        const searchVal = 'searchVal';
        await focusOnSearchInput(component);
        await modifySearchInput(component, searchVal);
        expect(searchFunction).toHaveBeenCalledWith(
          new FilterObjectClass({
            uid: 'search',
            field: 'label',
            value: searchVal,
            operator: comparisons.contains,
            type: filterTypes.text,
          })
        );
      });

      test('should not call async search fn when we modify the search input to empty', async () => {
        // setTimeoutMock.mockClear();
        expect(searchFunction).not.toHaveBeenCalled();
        const searchVal = '';
        await focusOnSearchInput(component);
        await modifySearchInput(component, searchVal);
        expect(searchFunction).not.toHaveBeenCalled();
      });

      test('should set not loading when search input set to empty', async () => {
        const loadingIcon = () => component.find(LoadingIcon);
        await focusOnSearchInput(component);

        await modifySearchInput(component, 'searchval');
        expect(loadingIcon().props().isLoading).toEqual(true);

        await modifySearchInput(component, '');
        expect(loadingIcon().props().isLoading).toEqual(false);
      });

      test.skip('should show results when we are focused on search field and results loaded', async () => {
        // TODO: Check why this fails!
        const searchVal = 'searchVal';
        await focusOnSearchInput(component);
        await modifySearchInput(component, searchVal);
        // setLoaded(component, demoResultData);
        // component.update();
        // jest.runOnlyPendingTimers();
        await runOnlyPendingTimers();
        const customSelectDropdown = component.find(CustomSelectDropdown);
        console.log(customSelectDropdown.props());
        expect(customSelectDropdown.props().isOpen).toEqual(true);
        expect(customSelectDropdown.props().options).toEqual(
          demoResultData.map((r) => ({ label: r.label, uid: r.uid }))
        );
      });

      test('should set search field to input value', () => {
        component = mount(
          <SearchAndSelectDropdown {...defaultProps} initialValue={demoResultData[0].label} />
        );
        const searchField = component.find('.searchField');
        expect(searchField.props().value).toEqual(demoResultData[0].label);
      });
    });
    describe('Allow empty search', () => {
      beforeEach(async () => {
        component = mount(
          <SearchAndSelectDropdown {...defaultProps} initialValue="" allowEmptySearch />
        );
        await runOnlyPendingTimers();
      });

      test('should still not call search function before focused', () => {
        searchFunction.mockClear();
        expect(searchFunction).not.toHaveBeenCalled();
      });

      test('should call async search fn when we modify the search input with empty value', async () => {
        await focusOnSearchInput(component);
        expect(searchFunction).toHaveBeenCalledWith();
      });
      test('should call async search func when input is set to empty', async () => {
        await focusOnSearchInput(component);
        await modifySearchInput(component, 'searchVal');
        searchFunction.mockClear();

        await modifySearchInput(component, '');
        expect(searchFunction).toHaveBeenCalledWith();
      });
    });
    describe('Dropdown Btn', () => {
      beforeEach(async () => {
        component = mount(
          <SearchAndSelectDropdown {...defaultProps} initialValue="" allowEmptySearch />
        );
        await runOnlyPendingTimers();
      });

      test('should call async search fn when click dropdown btn', async () => {
        await runOnlyPendingTimers();
        expect(searchFunction).not.toHaveBeenCalled();
        clickDopdownBtn(component);
        component.update();
        await runOnlyPendingTimers();
        expect(searchFunction).toHaveBeenCalledWith();
      });
    });
    describe.skip('Selection', () => {
      // TODO: Failing because stuck loading
      const selectedItem = demoResultData[0];
      const searchVal = 'searchVal';
      beforeEach(async () => {
        await focusOnSearchInput(component);
        await modifySearchInput(component, searchVal);
        await runOnlyPendingTimers();
        // setLoaded(component, demoResultData);
      });
      test('should call handleSelect when an item is selected from the customSelectDropdown', async () => {
        const customSelectDropdown = component.find(CustomSelectDropdown);
        await component.update();
        await runOnlyPendingTimers();
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
    describe('Using Forward Ref', () => {
      const searchVal = 'abc';
      let componentWithRef;
      let forwardedRef = React.createRef<HTMLInputElement>();
      beforeEach(async () => {
        componentWithRef = mount(
          <SearchAndSelectDropdown {...defaultProps} searchFieldRef={forwardedRef} />
        );

        await focusOnSearchInput(component);
        await modifySearchInput(component, searchVal);
        await runOnlyPendingTimers();
        // setLoaded(component, demoResultData);
      });
      test('should have passed ref', async () => {
        const searchInput = componentWithRef.find('.searchField');
        expect(searchInput.getElement().ref.current).toEqual(forwardedRef.current);
      });
    });
  });
});
