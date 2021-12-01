import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { MockReactC } from '@samnbuk/react_db_client.helpers.testing';
import { SearchAndSelectDropdown } from '@samnbuk/react_db_client.components.search-and-select-dropdown';

import { FieldObjectRef } from './field-object-ref';

jest.mock('@samnbuk/react_db_client.components.search-and-select-dropdown', () =>
  MockReactC('SearchAndSelectDropdown', ['SearchAndSelectDropdown'])
);

const updateFormData = jest.fn();
const searchFn = jest.fn();
const handleSelect = jest.fn();

const demoValue= {
  _id: 'demoitem',
  uid: 'demoitem',
  name: 'demoitem',
  label: 'demoitem',
}

const defaultProps = {
  uid: 'demoid',
  unit: 'demounit',
  updateFormData,
  handleSelect,
  value: demoValue,
  multiple: false,
  required: false,
  searchFn,
  returnFieldOnSelect: 'uid',
  searchFieldTargetField: 'name',
  labelField: 'name',
  collection: 'collection',
};

describe('FieldObjectRef', () => {
  beforeEach(() => {
    handleSelect.mockClear();
    updateFormData.mockClear();
    searchFn.mockClear();
  });
  test('Renders', () => {
    shallow(<FieldObjectRef {...defaultProps} />);
  });
  test('Matches Snapshot', () => {
    const component = shallow(<FieldObjectRef {...defaultProps} />);
    const tree = component.debug();
    expect(tree).toMatchSnapshot();
  });
  describe('shows a search select field', () => {
    let component;
    beforeEach(() => {
      component = mount(<FieldObjectRef {...defaultProps} />);
    });
    test('should show search and select component', () => {
      expect(component.find(SearchAndSelectDropdown)).toBeTruthy();
    });
  });
  describe('handles select', () => {
    let component;
    beforeEach(() => {
      component = mount(<FieldObjectRef {...defaultProps} />);
    });
    test('should call update fn when search component returns selection', () => {
      const searchComponent = component.find(SearchAndSelectDropdown);
      const selectedId = 'demoid';
      const selectedData = {};
      searchComponent.props().handleSelect(selectedId, selectedData);
      expect(updateFormData).toHaveBeenCalledWith(defaultProps.uid, selectedData);
    });
  });
  describe('Passes props to search and select', () => {
    let component;
    beforeEach(() => {
      component = mount(<FieldObjectRef {...defaultProps} />);
    });
    test('should provide default search function if searchFn override is null', () => {
      const searchAndSelectDropdown = component.find(SearchAndSelectDropdown);
      expect(searchAndSelectDropdown.props()).toMatchSnapshot();
    });
  });
});
