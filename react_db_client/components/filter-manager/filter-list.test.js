import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
// import renderer from 'react-test-renderer';
import { mount } from 'enzyme';


import {
    comparisons,
    FilterObjectClass,
    filterTypes,
  } from '@samnbuk/react_db_client.constants.client-types';

import { FiltersList } from './FiltersList';
import { demoFiltersData, demoFieldsData } from './demoData';


const deleteFilter = jest.fn();
const updateFilter = jest.fn();

const hiddenField = {
  uid: 'hiddenField',
  noFilter: true,
  label: 'Hidden Field',
  type: filterTypes.text,
};

const FiltersListDefaultProps = {
  filterData: [...demoFiltersData],
  deleteFilter,
  updateFilter,
  fieldsData: { ...demoFieldsData, hiddenField },
  customFilters: {},
};

describe('Filter List', () => {
  let component;
  beforeEach(() => {
    updateFilter.mockClear();
    deleteFilter.mockClear();
    component = mount(<FiltersList {...FiltersListDefaultProps} />);
  });
  test('should hide filters that have the no filter prop', () => {
    const firstItem = component.find('.filterPanel_filterItem').first();
    const selectFilter = firstItem.find('.filterItem_filterFieldSelect');
    const options = selectFilter.children().map((c) => c.props().value);
    expect(options.indexOf(Object.values(demoFieldsData)[0].uid)).toBeGreaterThan(-1);
    expect(options.indexOf(hiddenField.uid)).toEqual(-1);
  });
  test('should update filter correctly', () => {
    const newFilterField = demoFieldsData.count;

    const updateFilterSelect = component.find('.filterItem_filterFieldSelect').first();
    updateFilterSelect.simulate('change', { target: { value: newFilterField.uid } });
    component.update();
    expect(updateFilter).toHaveBeenCalledWith(
      0,
      new FilterObjectClass({
        field: newFilterField.uid,
        type: newFilterField.type,
        label: newFilterField.label,
        operator: comparisons.equals,
        filterOptionId: newFilterField.uid,
        value: 0,
        uid: expect.any(String),
      })
    );
  });
});
