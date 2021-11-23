import React from 'react';
import { shallow, mount } from 'enzyme';
import { MockReactC } from '../../../Helpers/testing';

import { FieldObjectRef } from './FieldObjectRef';
import { SearchAndSelectDropdown } from '@samnbuk/react_db_client.components.search-and-select-dropdown';

jest.mock('../../SearchAndSelect/SearchAndSelectDropdown', () =>
  MockReactC('SearchAndSelectDropdown')
);

const updateFormData = jest.fn();
const searchFn = jest.fn();
const handleSelect = jest.fn();

const defaultProps = {
  uid: 'demoid',
  unit: 'demounit',
  updateFormData,
  handleSelect,
  value: 'inputValue',
  multiple: false,
  required: false,
  searchFn,
  returnFieldOnSelect: 'uid',
  searchFieldTargetField: 'name',
  labelField: 'name',
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
      expect(updateFormData).toHaveBeenCalledWith(defaultProps.uid, selectedId);
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
