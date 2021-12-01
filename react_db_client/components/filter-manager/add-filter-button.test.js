import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
// import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';

import {
  comparisons,
  FilterObjectClass,
  filterTypes,
} from '@samnbuk/react_db_client.constants.client-types';

import { AddFilterButton } from './add-filter-button';
import { demoFieldsData } from './demoData';

describe('Add Filter Button Component', () => {
  test('should render', () => {
    shallow(<AddFilterButton fieldsData={demoFieldsData} returnNewFilter={() => {}} />);
  });
  test('should match snapshot', () => {
    const returnNewFilterFn = jest.fn();
    const component = shallow(
      <AddFilterButton fieldsData={demoFieldsData} returnNewFilter={returnNewFilterFn} />
    );
    const tree = component.debug();
    expect(tree).toMatchSnapshot();
  });
  test('should return a new filter when we click add filter btn', () => {
    const returnNewFilterFn = jest.fn();
    const component = mount(
      <AddFilterButton fieldsData={demoFieldsData} returnNewFilter={returnNewFilterFn} />
    );
    const addBtn = component.find('button');
    addBtn.simulate('click');
    expect(returnNewFilterFn).toHaveBeenCalled();
    expect(returnNewFilterFn.mock.calls[0] instanceof FilterObjectClass);
    expect(returnNewFilterFn).toHaveBeenCalledWith(
      new FilterObjectClass({
        field: 'name',
        label: 'Name',
        value: '',
        operator: comparisons.contains,
        type: filterTypes.text,
        uid: expect.any(String),
        filterOptionId: 'name',
      })
    );
  });
});