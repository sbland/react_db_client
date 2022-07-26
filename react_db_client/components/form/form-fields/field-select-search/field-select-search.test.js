import '@samnbuk/react_db_client.testing.enzyme-setup';
import React from 'react';
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { MockReactC } from '@react_db_client/testing.utils';

import { SearchAndSelectDropdown } from '@react_db_client/components.search-and-select-dropdown';

import { FieldSelectSearch } from './field-select-search';
import * as compositions from './field-select-search.composition';
import { defaultVal } from './demo-data';

jest.mock('@react_db_client/components.search-and-select-dropdown', () =>
  MockReactC('SearchAndSelectDropdown', ['SearchAndSelectDropdown'])
);

const updateFormData = jest.fn();
const searchFn = jest.fn();

const defaultProps = {
  uid: 'demoid',
  unit: 'demounit',
  updateFormData,
  value: defaultVal,
  multiple: false,
  required: false,
  searchFn,
  returnFieldOnSelect: 'uid',
  searchFieldTargetField: 'name',
  labelField: 'name',
};

describe('field-select-search', () => {
  beforeEach(() => {
    updateFormData.mockClear();
    searchFn.mockClear();
  });
  test('Renders', () => {
    shallow(<FieldSelectSearch {...defaultProps} />);
  });

  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, () => {
        mount(<Composition />);
      });
    });
  });
  describe('Snapshots', () => {
    test('Matches Snapshot', () => {
      const component = mount(<FieldSelectSearch {...defaultProps} />);
      const tree = component.debug();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Unit Tests', () => {
    let component;
    beforeEach(() => {
      component = mount(<FieldSelectSearch {...defaultProps} />);
    });
    describe('Searching', () => {
      /* Searching handled by search and select dropdown. */
      test('should call search function', () => {
        const searchAndSelectDropdown = component.find(SearchAndSelectDropdown);
        const searchText = "searchText";
        act(() => {
          searchAndSelectDropdown.props().searchFunction(searchText);
        });
        expect(searchFn).toHaveBeenCalledWith(searchText);
      });
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
        const selectedData = { uid: selectedId };
        searchComponent.props().handleSelect(selectedId, selectedData);
        expect(updateFormData).toHaveBeenCalledWith(defaultProps.uid, selectedId);
      });
    });
  });
});
