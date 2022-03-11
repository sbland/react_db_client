import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import toJson from 'enzyme-to-json';
import { createSerializer } from 'enzyme-to-json';
import { MockReactC } from '@samnbuk/react_db_client.helpers.testing';
import {
  FilterObjectClass,
  filterTypes,
  comparisons,
} from '@samnbuk/react_db_client.constants.client-types';
import { useAsyncRequest } from '@samnbuk/react_db_client.async-hooks.use-async-request';
import { StyledSelectList } from '@samnbuk/react_db_client.components.styled-select-list';

import { demoFiltersData, demoFieldsData } from '@samnbuk/react_db_client.constants.demo-data';
import { SearchAndSelect } from './search-and-select';
import { demoResultData, demoHeadingsData } from './demo-data';
import { useSelectionManager } from './logic';

const DEFAULT_SORT_BY = 'uid';
// TODO: Mock styled select list

jest.mock('@samnbuk/react_db_client.async-hooks.use-async-request', () => ({
  useAsyncRequest: jest.fn(),
}));

jest.mock('./logic', () => ({
  useSelectionManager: jest.fn(),
}));

jest.mock('@samnbuk/react_db_client.components.styled-select-list', () =>
  MockReactC('StyledSelectList', ['StyledSelectList'])
);

const searchFunction = jest.fn().mockName('searchFunc');
const handleSelect = jest
  .fn()
  .mockName('handleSelect')
  .mockImplementation(() => {});
const mockLoadFn = jest.fn();

const reload = jest.fn().mockName('reload');

const defaultSasProps = {
  searchFunction,
  initialFilters: demoFiltersData,
  availableFilters: demoFieldsData,
  handleSelect,
  headings: demoHeadingsData,
};

const defaultAsyncHookReturn = {
  reload,
  loading: false,
  response: null,
};

const defaultUseSelectionManagerState = {
  currentSelection: [],
  currentSelectionUid: [],
  handleItemSelect: jest.fn().mockName('handleItemSelect'),
  selectAll: jest.fn().mockName('selectAll'),
  clearSelection: jest.fn().mockName('clearSelection'),
  acceptSelection: jest.fn().mockName('acceptSelection'),
};

expect.addSnapshotSerializer(createSerializer({ mode: 'deep' }));

describe('Search and Select', () => {
  describe('Snapshots', () => {
    beforeEach(() => {
      useAsyncRequest.mockClear();
      useSelectionManager.mockClear();
      useAsyncRequest.mockImplementation(() => defaultAsyncHookReturn);
      useSelectionManager.mockImplementation(() => defaultUseSelectionManagerState);
    });

    test('Default', () => {
      const component = shallow(<SearchAndSelect {...defaultSasProps} />);
      expect(toJson(component)).toMatchSnapshot();
    });

    test('Default - with results', () => {
      useAsyncRequest.mockReturnValue({ ...defaultAsyncHookReturn, response: demoResultData });
      const component = shallow(<SearchAndSelect {...defaultSasProps} />);
      expect(toJson(component)).toMatchSnapshot();
    });

    test('Default - loading', () => {
      useAsyncRequest.mockReturnValue({ ...defaultAsyncHookReturn, loading: true });
      const component = shallow(<SearchAndSelect {...defaultSasProps} />);
      expect(toJson(component)).toMatchSnapshot();
    });
    test('Default - with search field', () => {
      useAsyncRequest.mockReturnValue({ ...defaultAsyncHookReturn, loading: true });
      const props = { ...defaultSasProps, showSearchField: true, searchFieldTargetField: 'name' };
      const component = shallow(<SearchAndSelect {...props} />);
      expect(toJson(component)).toMatchSnapshot();
    });
    test('Default - with refresh btn', () => {
      useAsyncRequest.mockReturnValue({ ...defaultAsyncHookReturn, loading: true });
      const props = { ...defaultSasProps, showRefreshBtn: true };
      const component = shallow(<SearchAndSelect {...props} />);
      expect(toJson(component)).toMatchSnapshot();
    });
    test('Multiple - with live update', () => {
      useAsyncRequest.mockReturnValue({ ...defaultAsyncHookReturn, loading: true });
      const props = { ...defaultSasProps, allowMultiple: true, liveUpdate: true };
      const component = shallow(<SearchAndSelect {...props} />);
      expect(toJson(component)).toMatchSnapshot();
    });
  });

  describe('Unit Testing', () => {
    // Note we need to remount the SAS component for each test to ensure the hook mocks are updated

    beforeEach(() => {
      searchFunction.mockClear();
      handleSelect.mockClear();
      defaultAsyncHookReturn.reload.mockClear();
      defaultUseSelectionManagerState.handleItemSelect.mockClear();
      defaultUseSelectionManagerState.selectAll.mockClear();
      defaultUseSelectionManagerState.clearSelection.mockClear();
      useAsyncRequest.mockClear();
      useSelectionManager.mockClear();
      useAsyncRequest.mockImplementation(() => defaultAsyncHookReturn);
      useSelectionManager.mockImplementation(() => defaultUseSelectionManagerState);
    });

    describe('Performing Search', () => {
      test('should pass correct values to async hook', () => {
        mount(<SearchAndSelect {...defaultSasProps} />);
        expect(useAsyncRequest).toHaveBeenCalledWith({
          args: [],
          callFn: searchFunction,
          callOnInit: false,
        });
      });

      test('If autoupdate is off does not load anything', () => {
        const props = { ...defaultSasProps, autoUpdate: false };
        mount(<SearchAndSelect {...props} />);
        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledTimes(0);
      });

      test('should not load on init when loadOnInit is false', () => {
        const props = { ...defaultSasProps, autoUpdate: true, loadOnInit: false };
        mount(<SearchAndSelect {...props} />);
        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledTimes(0);
      });

      test('should not perform search if filters empty and noEmptySearch is true', () => {
        const props = {
          ...defaultSasProps,
          autoUpdate: true,
          noEmptySearch: true,
          initialFilters: [],
        };
        mount(<SearchAndSelect {...props} />);
        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledTimes(0);
      });

      test('Triggers search when we turn on autoupdate and loadOnInit is true', () => {
        const props = { ...defaultSasProps, autoUpdate: true };
        mount(<SearchAndSelect {...props} />);
        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledTimes(1);
        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledWith([
          demoFiltersData,
          DEFAULT_SORT_BY,
          '',
          false,
        ]);
      });

      test('should show loading icon when loading results', () => {
        useAsyncRequest.mockReturnValue({ ...defaultAsyncHookReturn, loading: true });
        const component = mount(<SearchAndSelect {...defaultSasProps} />);
        expect(component.exists('.sas_loadingWrap')).toBeTruthy();
      });

      test('should not show loading icon when not loading results', () => {
        useAsyncRequest.mockReturnValue({ ...defaultAsyncHookReturn, loading: false });
        const component = mount(<SearchAndSelect {...defaultSasProps} />);
        expect(component.exists('.sas_loadingWrap')).not.toBeTruthy();
      });

      test('Displays a list of results when search returns', () => {
        useAsyncRequest.mockReturnValue({
          ...defaultAsyncHookReturn,
          response: demoResultData,
        });
        const props = { ...defaultSasProps, autoUpdate: true };
        const component = mount(<SearchAndSelect {...props} />);
        expect(component.find(StyledSelectList).props().listInput).toEqual(demoResultData);
      });
      test('should send search sort order to async request', () => {
        const sortBy = 'uid';
        const props = { ...defaultSasProps, autoUpdate: true, sortBy };
        mount(<SearchAndSelect {...props} />);
        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledTimes(1);
        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledWith([
          demoFiltersData,
          sortBy,
          '',
          false,
        ]);
      });
    });
    describe('Selecting Single', () => {
      test('should call handleSelect when a list item is selected and we hit accept selection', () => {
        useAsyncRequest.mockReturnValue({
          ...defaultAsyncHookReturn,
          response: demoResultData,
        });
        const component = mount(<SearchAndSelect {...defaultSasProps} />);
        const styledSelectList = component.find(StyledSelectList);
        expect(styledSelectList.props().listInput).toEqual(demoResultData);
        styledSelectList.props().handleSelect(demoResultData[0].uid);
        expect(defaultUseSelectionManagerState.handleItemSelect).toHaveBeenCalledWith(
          demoResultData[0].uid
        );
      });

      test('should show results but unclickable when loading', () => {
        useAsyncRequest.mockReturnValue({
          ...defaultAsyncHookReturn,
          loading: true,
          response: demoResultData,
        });
        const component = mount(<SearchAndSelect {...defaultSasProps} />);
        expect(component.exists('.sas_loadingWrap')).toBeTruthy();
        const styledSelectList = component.find(StyledSelectList);
        expect(styledSelectList.props().listInput).toEqual(demoResultData);
        styledSelectList.props().handleSelect('demoid');
        expect(defaultUseSelectionManagerState.handleItemSelect).not.toHaveBeenCalled();
      });

      test('should show results as clickable when not loading', () => {
        useAsyncRequest.mockReturnValue({
          ...defaultAsyncHookReturn,
          loading: false,
          response: demoResultData,
        });
        const component = mount(<SearchAndSelect {...defaultSasProps} />);
        const styledSelectList = component.find(StyledSelectList);
        expect(styledSelectList.props().listInput).toEqual(demoResultData);
        styledSelectList.props().handleSelect('demoid');
        expect(defaultUseSelectionManagerState.handleItemSelect).toHaveBeenCalled();
      });
    });
    describe('Multiple Select', () => {
      const defaultSasPropsMultiSel = { ...defaultSasProps, allowMultiple: true };
      const demoCurrentSelection = [demoResultData[0]];
      const setupMultiComponent = () => {
        useAsyncRequest.mockReturnValue({
          ...defaultAsyncHookReturn,
          response: demoResultData,
        });
        useSelectionManager.mockReturnValue({
          ...defaultUseSelectionManagerState,
          currentSelection: demoCurrentSelection,
          currentSelectionUid: demoCurrentSelection.map((d) => d.uid),
        });

        const component = mount(<SearchAndSelect {...defaultSasPropsMultiSel} />);
        return component;
      };

      // Helper func for selecting an item action
      const selectItem = (component, selectedUid, selectedData) => {
        const styledSelectList = component.find(StyledSelectList);
        act(() => {
          styledSelectList.props().handleSelect(selectedUid, selectedData);
        });
        // const resultsList = component.find('.sas_resultsList').children();
        // const firstItemBtn = resultsList.find('.styledList_itemBtn').at(i);
        // expect(firstItemBtn).toBeTruthy();
        // firstItemBtn.simulate('click');
      };

      test('Calls handleItemSelect when a result item is clicked', () => {
        const component = setupMultiComponent();
        selectItem(component, demoResultData[0].uid, demoResultData[0]);
        expect(defaultUseSelectionManagerState.handleItemSelect).toHaveBeenCalledWith(
          demoResultData[0].uid,
          demoResultData[0]
        );
        selectItem(component, demoResultData[1].uid, demoResultData[1]);
        expect(defaultUseSelectionManagerState.handleItemSelect).toHaveBeenCalledWith(
          demoResultData[1].uid,
          demoResultData[1]
        );
      });

      test('should show selected items as selected in list', () => {
        const component = setupMultiComponent();
        const selectAllBtn = component.find('.selectAllBtn');

        selectAllBtn.simulate('click');
        component.update();
        component.update();
        const selectList = component.find(StyledSelectList);
        const expectedLength = demoCurrentSelection.length;
        expect(selectList.props().currentSelection.length).toEqual(expectedLength);
      });

      test('Calls selection manager accept selection when clicking accept selection button', () => {
        const component = setupMultiComponent();
        const acceptSelectionBtn = component.find('.acceptSelectionBtn');
        acceptSelectionBtn.simulate('click');
        expect(defaultUseSelectionManagerState.acceptSelection).toHaveBeenCalled();
      });

      test('Call select all when clicking select all button', () => {
        const component = setupMultiComponent();
        const selectAllBtn = component.find('.selectAllBtn');
        expect(selectAllBtn).toBeTruthy();
        selectAllBtn.simulate('click');
        expect(defaultUseSelectionManagerState.selectAll).toHaveBeenCalled();
      });
    });
    describe('Search Field', () => {
      const defaultSasPropsSearchField = {
        ...defaultSasProps,
        autoUpdate: true,
        initialFilters: [],
        showSearchField: true,
        searchFieldTargetField: 'name',
      };
      const setupSearchComponent = (props) => {
        useAsyncRequest.mockReturnValue({
          ...defaultAsyncHookReturn,
          response: demoResultData,
        });
        const component = mount(<SearchAndSelect {...props} />);
        return component;
      };

      test('should initiate search on search field input', () => {
        const component = setupSearchComponent(defaultSasPropsSearchField);
        const searchField = component.find('.searchField');

        let filters = [];
        let searchValue = '';

        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledWith([
          filters,
          DEFAULT_SORT_BY,
          null,
          false,
        ]);
        mockLoadFn.mockClear();
        defaultAsyncHookReturn.reload.mockClear();

        searchValue = 'New Search';
        searchField.simulate('change', { target: { value: searchValue } });
        filters = [
          new FilterObjectClass({
            uid: 'search',
            field: defaultSasPropsSearchField.searchFieldTargetField,
            value: searchValue,
            operator: comparisons.contains,
            type: filterTypes.text,
          }),
        ];
        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledWith([
          filters,
          DEFAULT_SORT_BY,
          null,
          false,
        ]);
      });
      test('should rerun search without search field if set to empty string', () => {
        const component = setupSearchComponent(defaultSasPropsSearchField);
        const searchValue = 'abc';
        const searchField = component.find('.searchField');

        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledWith([
          [],
          DEFAULT_SORT_BY,
          null,
          false,
        ]);
        mockLoadFn.mockClear();

        expect(searchField).toBeTruthy();
        searchField.simulate('change', { target: { value: searchValue } });

        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledWith([
          [
            new FilterObjectClass({
              uid: 'search',
              field: defaultSasPropsSearchField.searchFieldTargetField,
              value: searchValue,
              operator: comparisons.contains,
              type: filterTypes.text,
            }),
          ],
          DEFAULT_SORT_BY,
          null,
          false,
        ]);
        mockLoadFn.mockClear();

        searchField.simulate('change', { target: { value: '' } });

        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledWith([
          [],
          DEFAULT_SORT_BY,
          null,
          false,
        ]);
      });
      test('should run search with text search field if target search field prop is null', () => {
        const component = setupSearchComponent({
          ...defaultSasPropsSearchField,
          searchFieldTargetField: null,
        });
        let searchValue = '';
        const searchField = component.find('.searchField');

        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledWith([
          [],
          DEFAULT_SORT_BY,
          searchValue,
          false,
        ]);
        defaultAsyncHookReturn.reload.mockClear();
        searchValue = 'abc';

        expect(searchField).toBeTruthy();
        searchField.simulate('change', { target: { value: searchValue } });

        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledWith([
          [],
          DEFAULT_SORT_BY,
          searchValue,
          false,
        ]);
        defaultAsyncHookReturn.reload.mockClear();
        searchValue = '';

        searchField.simulate('change', { target: { value: '' } });

        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledTimes(1);
        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledWith([
          [],
          DEFAULT_SORT_BY,
          searchValue,
          false,
        ]);
      });
    });
    describe('Refresh button', () => {
      test('should run search when refresh button is pressed', () => {
        const props = { ...defaultSasProps, autoUpdate: false, showRefreshBtn: true };
        const component = mount(<SearchAndSelect {...props} />);
        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledTimes(0);
        const refreshBtn = component.find('.refreshBtn');
        refreshBtn.simulate('click');
        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledTimes(1);
      });
    });
    describe('Updating props', () => {
      test('should update the filters if initial filters is updated', () => {
        const initialFilters = [
          new FilterObjectClass({
            uid: 'demoFilterString',
            field: 'name',
            value: 'Foo',
            operator: comparisons.contains,
            type: filterTypes.text,
          }),
        ];
        const updatedFilters = [
          new FilterObjectClass({
            uid: 'demoFilterString',
            field: 'name',
            value: 'Bar',
            operator: comparisons.contains,
            type: filterTypes.text,
          }),
        ];
        const props = { ...defaultSasProps, initialFilters, showRefreshBtn: true, autoUpdate: true };
        const component = mount(<SearchAndSelect {...props} />);
        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledWith([
          [
            {
              field: 'name',
              filterOptionId: 'name',
              label: 'name',
              operator: 'contains',
              type: 'text',
              uid: 'demoFilterString',
              value: 'Foo',
            },
          ],
          'uid',
          '',
          false,
        ]);
        defaultAsyncHookReturn.reload.mockClear();
        component.setProps({ initialFilters: updatedFilters });
        component.update();
        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledWith([
          [
            {
              field: 'name',
              filterOptionId: 'name',
              label: 'name',
              operator: 'contains',
              type: 'text',
              uid: 'demoFilterString',
              value: 'Bar',
            },
          ],
          'uid',
          '',
          false,
        ]);
      });
    });
  });

  describe('Error Handling', () => {
    let homepageErrors;
    beforeAll(() => {
      homepageErrors = console.error.bind(console.error);
      console.error = (errormessage) => {
        return;
        const suppressedErrors =
          errormessage.toString().includes('Warning: Failed prop type:') ||
          errormessage.toString().includes('Error: Uncaught [TypeError: Initial');
        !suppressedErrors && homepageErrors(errormessage);
      };
    });
    afterAll(() => {
      console.error = homepageErrors;
    });
    test('should throw error if initial filters is not an array', () => {
      // NOTE: For some reason the error is still displayed in cli.
      expect(() =>
        mount(
          <SearchAndSelect
            searchFunction={async () => {}}
            initialFilters={{}}
            availableFilters={demoFieldsData}
            handleSelect={() => {}}
            headings={demoHeadingsData}
          />
        )
      ).toThrow('Initial Filters should be an array');
    });
  });
});
