import '@samnbuk/react_db_client.testing.enzyme-setup';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { FilterObjectClass } from '@react_db_client/constants.client-types';
import { SearchAndSelectDropdown } from '@samnbuk/react_db_client.components.search-and-select-dropdown';

import { FieldObjectRef } from './field-object-ref';
import * as compositions from './field-object-ref.composition';

const updateFormData = jest.fn();
const asyncGetDocuments = jest.fn();
const handleSelect = jest.fn();

const demoValue = {
  _id: 'demoitem',
  uid: 'demoitem',
  name: 'demoitem',
  label: 'demoitem',
};

const defaultProps = {
  uid: 'demoid',
  unit: 'demounit',
  updateFormData,
  handleSelect,
  asyncGetDocuments,
  value: demoValue,
  multiple: false,
  required: false,
  labelField: 'name',
  collection: 'collection',
};

describe('FieldObjectRef', () => {
  /* SETUP */
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  beforeEach(() => {
    handleSelect.mockClear();
    updateFormData.mockClear();
    asyncGetDocuments.mockClear();
  });

  /* Tests */
  test('Renders', () => {
    shallow(<FieldObjectRef {...defaultProps} />);
  });
  test('Matches Snapshot', () => {
    const component = shallow(<FieldObjectRef {...defaultProps} />);
    const tree = component.debug();
    expect(tree).toMatchSnapshot();
  });

  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, () => {
        mount(<Composition />);
      });
    });
  });

  describe('Unit tests', () => {
    let component;
    beforeEach(() => {
      component = mount(<FieldObjectRef {...defaultProps} />);
    });
    describe('shows a search select field', () => {
      test('should show search and select component', () => {
        expect(component.find(SearchAndSelectDropdown)).toBeTruthy();
      });
    });
    describe('handles select', () => {
      test('should call update fn when search component returns selection', () => {
        const searchComponent = component.find(SearchAndSelectDropdown);
        const selectedId = 'demoid';
        const selectedData = {};
        searchComponent.props().handleSelect(selectedId, selectedData);
        expect(updateFormData).toHaveBeenCalledWith(defaultProps.uid, selectedData);
      });
    });
    describe('Passes props to search and select', () => {
      test('should provide default search function if searchFn override is null', () => {
        const searchAndSelectDropdown = component.find(SearchAndSelectDropdown);
        expect(searchAndSelectDropdown.props()).toMatchSnapshot();
      });
    });
    describe('Searching', () => {
      test('Entering search input should call async get documents', async () => {
        // TODO: Complete this
        const searchField = component.find('input').find('[type="text"]').first();
        act(() => {
          searchField.simulate('focus');
          component.update();
        });
        const searchValue = 'Search Val';
        await act(async () => {
          searchField.simulate('change', { target: { value: searchValue } });
          component.update();
          jest.runOnlyPendingTimers();
          component.update();
          jest.runOnlyPendingTimers();
        });
        const collection = defaultProps.collection;
        const filters = [
          new FilterObjectClass({
            uid: 'search',
            field: defaultProps.labelField,
            value: searchValue,
          }),
        ];
        const schema = '_id';
        const sortBy = defaultProps.labelField;
        expect(asyncGetDocuments).toHaveBeenCalledWith(collection, filters, schema, sortBy);
      });
    });
  });
});
