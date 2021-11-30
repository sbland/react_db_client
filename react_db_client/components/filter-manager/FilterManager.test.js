import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
// import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import cloneDeep from 'lodash/cloneDeep';

import {
  comparisons,
  FilterObjectClass,
  filterTypes,
  filterTypesDefaults,
} from '@samnbuk/react_db_client.constants.client-types';

import { AddFilterButton } from './add-filter-button';
import { FilterPanel } from './filter-manager';
import FilterString from './FilterTypes/FilterString';
import FilterNumber from './FilterTypes/FilterNumber';
import { FiltersList } from './FiltersList';

import { demoFiltersData, demoFieldsData } from './demoData';

const addFilter = jest.fn();
const deleteFilter = jest.fn();
const updateFilter = jest.fn();
const clearFilters = jest.fn();

const defaultProps = {
  filterData: demoFiltersData,
  addFilter,
  deleteFilter,
  updateFilter,
  clearFilters,
  showPanelOverride: true,
  fieldsData: demoFieldsData,
  floating: false,
  autoOpenPanel: false,
  customFilters: { hello: () => {} },
  customFiltersComponents: { hello: () => {} },
};

describe('FilterPanel', () => {
  it('Renders', () => {
    shallow(<FilterPanel {...defaultProps} />);
  });
  it('Matches Snapshot', () => {
    const component = mount(<FilterPanel {...defaultProps} />);
    const tree = component.debug();
    expect(tree).toMatchSnapshot();
  });

  let demoFiltersCopy = cloneDeep(demoFiltersData);
  describe('filters', () => {
    const setFilterDataFunc = jest.fn();
    let filterPanel;
    let homepageErrors;

    beforeEach(() => {
      filterPanel = mount(<FilterPanel {...defaultProps} />);
      updateFilter.mockClear();
      deleteFilter.mockClear();
      addFilter.mockClear();
      clearFilters.mockClear();
    });
    afterEach(() => {
      setFilterDataFunc.mockClear();
      demoFiltersCopy = cloneDeep(demoFiltersData);
    });

    describe('Edit Filter', () => {
      let filterList;
      beforeEach(() => {
        filterList = filterPanel.find('.filterPanel_filterList');
      });
      it('Shows a filter for each filter item', () => {
        const filterCount = demoFiltersCopy.length;
        expect(filterList.find('.filterPanel_filterItem').length).toEqual(filterCount);
      });

      it('Entering text into a string filter will update the value in the filter data', () => {
        const filterInput = filterList.find(FilterString).first().find('.filterInput');
        const newVal = 'efg';
        filterInput.simulate('change', { target: { value: newVal } });
        // expect(activeFilterData.demoFilterString.value).toEqual(newVal);
        const newFilterData = demoFiltersCopy;
        newFilterData[0].value = newVal;
        expect(updateFilter).toHaveBeenCalledWith(0, newFilterData[0]);
      });

      it('Entering text into a number filter will update the value in the filter data', () => {
        const filterInput = filterList.find(FilterNumber).first().find('.filterInput');
        const newVal = 3;
        filterInput.simulate('change', { target: { value: newVal } });
        const newFilterData = demoFiltersCopy;
        newFilterData[1].value = newVal;
        expect(updateFilter).toHaveBeenCalledWith(1, newFilterData[1]);
      });
      it('Changing the filter operator dropdown updates the operator', () => {
        const filterSelect = filterList.find(FilterNumber).first().find('.filterOperatorSelect');
        const newOperator = comparisons.equals;
        filterSelect.simulate('change', { target: { value: newOperator } });
        const newFilterData = demoFiltersCopy;
        newFilterData[1].operator = newOperator;
        expect(updateFilter).toHaveBeenCalledWith(1, newFilterData[1]);
      });

      it('shows the correct field value in the field dropdown', () => {
        const filterNumber = filterList
          .find('.filterPanel_filterItem')
          .filter({ id: 'demoFilterNumber' });
        const fieldDropdown = filterNumber.find('.filterItem_filterFieldSelect');
        expect(fieldDropdown.props().value).toEqual('count');
      });
    });

    describe('using filterOptionId', () => {
      test('should update a filter that has a different filterOptionId and field', () => {
        const fieldsData = {
          filterA: {
            uid: 'filterA',
            field: 'fieldA',
            label: 'Field A',
            type: filterTypes.text,
          },
          filterB: {
            uid: 'filterB',
            field: 'fieldA',
            label: 'Field A copy',
            type: filterTypes.text,
          },
        };
        filterPanel = mount(
          <FilterPanel
            {...defaultProps}
            filterData={[]}
            showPanelOverride
            fieldsData={fieldsData}
          />
        );
        const addFilterButton = filterPanel.find('.addFilterBtn');
        addFilterButton.simulate('click');
        filterPanel.update();
        let filterData = [
          new FilterObjectClass({
            operator: comparisons.contains,
            field: 'fieldA',
            filterOptionId: 'filterA',
            label: 'Field A',
            type: filterTypes.text,
            uid: expect.any(String),
            value: '',
          }),
        ];
        expect(addFilter).toHaveBeenCalledWith(filterData[0]);
        filterData = [
          new FilterObjectClass({
            operator: comparisons.contains,
            field: 'fieldA',
            filterOptionId: 'filterA',
            label: 'Field A',
            type: filterTypes.text,
            uid: 'uid',
            value: '',
          }),
        ];
        filterPanel.setProps({ filterData });
        const filterList = filterPanel.find(FiltersList);
        expect(filterList.props().filterData).toEqual(filterData);
        let filterFieldSelect = filterList.find('.filterItem_filterFieldSelect').first();
        filterFieldSelect.simulate('change', { target: { value: 'filterB' } });
        filterPanel.update();
        let updatedFilterData = [
          new FilterObjectClass({
            operator: 'contains',
            field: 'fieldA',
            filterOptionId: 'filterB',
            label: 'Field A copy',
            type: 'text',
            uid: expect.any(String),
            value: '',
          }),
        ];
        expect(updateFilter).toHaveBeenCalledWith(0, updatedFilterData[0]);
        updatedFilterData = [
          new FilterObjectClass({
            operator: 'contains',
            field: 'fieldA',
            filterOptionId: 'filterB',
            label: 'Field A copy',
            type: 'text',
            uid: 'uid',
            value: '',
          }),
        ];
        filterPanel.setProps({ filterData: updatedFilterData });
        filterFieldSelect = filterPanel.find('.filterItem_filterFieldSelect').first();
        expect(filterFieldSelect.props().value).toEqual('filterB');
      });
    });

    describe('Filter Types', () => {
      let component;
      let fieldsData;
      let filterData;

      beforeAll(() => {
        homepageErrors = console.error.bind(console.error);
        console.error = (errormessage) => {
          // return;
          const suppressedErrors = errormessage.toString().includes('Warning: Failed prop type:');
          !suppressedErrors && homepageErrors(errormessage);
        };
        // create filterdata
        filterData = Object.keys(filterTypes).map(
          (key) =>
            new FilterObjectClass({
              uid: key,
              field: key,
              value: filterTypesDefaults[key],
              value: null,
              operator: comparisons.greaterThan,
              type: key,
            })
        );

        fieldsData = {};
        Object.keys(filterTypes).forEach((key) => {
          fieldsData[key] = {
            uid: key,
            label: key,
            type: key,
          };
        });

        component = mount(
          <FilterPanel {...defaultProps} filterData={filterData} fieldsData={fieldsData} />
        );
      });

      afterAll(() => {
        console.error = homepageErrors;
      });
      // TODO: Fix these tests
      test('Contains filter for all filter types', () => {
        const filterCount = filterData.length;
        expect(component.find('.filterPanel_filterItem').length).toEqual(filterCount);
        expect(component.find('.invalidFilter').length).toEqual(0);
      });
    });

    describe('Delete Filter', () => {
      filterPanel = mount(
        <FilterPanel
          {...defaultProps}
          filterData={demoFiltersCopy}
          showPanelOverride
          fieldsData={demoFieldsData}
        />
      );

      test('Deletes filter on delete btn press', () => {
        const filterList = filterPanel.find('.filterPanel_filterList');
        const deleteBtn = filterList.find('.deleteFilterBtn').first();
        deleteBtn.simulate('click');
        expect(deleteFilter).toHaveBeenCalledWith(0);
      });
    });

    describe('Add Filter', () => {
      filterPanel = mount(<FilterPanel {...defaultProps} />);
      test('Add filter on add btn press', () => {
        const addFilterBtn = filterPanel.find(AddFilterButton).first();
        const newFilterData = new FilterObjectClass({ ...demoFiltersCopy[0] });
        addFilterBtn.props().returnNewFilter(newFilterData);
        filterPanel.update();
        expect(addFilter).toHaveBeenCalled();
        const newFilter = addFilter.mock.calls[0][0];
        expect(newFilter instanceof FilterObjectClass).toBeTruthy();
        expect(newFilter).toEqual(newFilterData);
      });
    });
  });

  describe('updating filters', () => {
    //
  });
  describe('custom filters', () => {
    const customFilter = jest.fn();
    const CustomFilterComponent = () => <div>Custom Filter</div>;
    const customFilters = { customFilter };
    const customFiltersComponents = { customFilter: CustomFilterComponent };
    const fieldsData = {
      ...demoFieldsData,
      customField: { uid: 'customField', type: 'customFilter', label: 'Custom field' },
    };
    let filterPanel;
    let warnings;
    beforeAll(() => {
      warnings = console.warn.bind(console.warn);
      console.warn = (errormessage) => {
        // return;
        const suppressedErrors = errormessage.toString().includes('Invalid Filter Type customFilter must set isCustomType');
        !suppressedErrors && warnings(errormessage);
      };
    });
    afterAll(() => {
      console.warn = warnings;
    });

    beforeEach(() => {
      filterPanel = mount(
        <FilterPanel
          {...defaultProps}
          customFilters={customFilters}
          fieldsData={fieldsData}
          customFiltersComponents={customFiltersComponents}
        />
      );
      updateFilter.mockClear();
      deleteFilter.mockClear();
      addFilter.mockClear();
      clearFilters.mockClear();
      customFilter.mockClear();
    });
    test('should pass custom filters to filter list component', () => {
      const filterList = filterPanel.find(FiltersList);
      expect(filterList.props().customFilters).toEqual(customFilters);
      expect(filterList.props().customFiltersComponents).toEqual(customFiltersComponents);
    });
    test('should be able to call update filter with custom filter', () => {
      const filterFieldSelect = filterPanel.find('.filterItem_filterFieldSelect').first();
      filterFieldSelect.simulate('change', { target: { value: 'customField' } });
      expect(updateFilter).toHaveBeenCalledWith(
        0,
        new FilterObjectClass({
          operator: '=',
          field: 'customField',
          type: 'customFilter',
          uid: 'customField',
          label: 'Custom field',
          value: '',
        })
      );
    });

    test('should allow adding a custom filter to the filter list', () => {
      let customFilterComponent = filterPanel.find(CustomFilterComponent);
      expect(customFilterComponent.exists()).not.toBeTruthy();
      filterPanel.setProps({
        filterData: [
          new FilterObjectClass({
            operator: '=',
            field: 'customField',
            type: 'customFilter',
            uid: 'customField',
            label: 'Custom field',
            value: '',
          }),
        ],
      });
      filterPanel.update();
      customFilterComponent = filterPanel.find(CustomFilterComponent);
      expect(customFilterComponent.exists()).toBeTruthy();
    });
    test.skip('should check that a non standard field type has an associated custom filter', () => {
      //
    });
    test.skip('should pass custom filters to filter manager', () => {
      //
    });
  });
});
