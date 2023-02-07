import React from 'react';
import { render, screen, within, waitFor } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import cloneDeep from 'lodash/cloneDeep';

import * as compositions from './filter-manager.composition';
import { comparisons, EComparisons } from '@react_db_client/constants.client-types';
import { FilterObjectClass } from '@react_db_client/constants.client-types';
import { FilterPanel, IFilterPanelProps } from './filter-manager';
import {
  demoFiltersData,
  demoFieldsData,
  demoFilterCustom,
  customFilters,
  customFiltersComponents,
  demoFilterString,
  demoFilterNumber,
  customField,
} from './demoData';

const addFilter = jest.fn();
const deleteFilter = jest.fn();
const updateFilter = jest.fn();
const clearFilters = jest.fn();
const updateFieldTarget = jest.fn();
const updateOperator = jest.fn();

const defaultProps: IFilterPanelProps = {
  filters: demoFiltersData,
  addFilter,
  deleteFilter,
  updateFilter,
  clearFilters,
  updateFieldTarget,
  updateOperator,
  showPanelOverride: true,
  fieldsData: demoFieldsData,
  floating: false,
  autoOpenPanel: false,
  customFilters,
  customFiltersComponents,
};

let demoFiltersCopy = cloneDeep(demoFiltersData);

// const demoFilterString = demoFiltersData.find(
//   (f) => f.type === EFilterType.text
// ) as FilterObjectClass;

// const demoFilterNumber = demoFiltersData.find(
//   (f) => f.type === EFilterType.number
// ) as FilterObjectClass;

describe('Filter Manager', () => {
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, () => {
        render(<Composition />);
      });
      // test(`Matches Snapshot ${name}`, () => {
      //   render(<Composition />);

      //   const tree = screen.debug();
      //   expect(tree).toMatchSnapshot();
      // });
    });
  });
  describe('Unit Tests', () => {
    beforeEach(() => {
      updateFilter.mockClear();
      deleteFilter.mockClear();
      addFilter.mockClear();
      clearFilters.mockClear();
      updateFieldTarget.mockClear();
      updateOperator.mockClear();
      render(<FilterPanel {...defaultProps} />);
    });
    test('should show a filter for each filter item', () => {
      const filterCount = demoFiltersCopy.length;
      const filterListItems = screen.getAllByRole('listitem');
      expect(filterListItems.length).toBeGreaterThan(0);
      expect(filterListItems.length).toEqual(filterCount);
    });

    test('Entering text into a string filter will update the value in the filter data', async () => {
      const filterListItems = screen.getAllByRole('listitem');
      const filterStringItem = filterListItems.find(
        (f) => within(f).queryByLabelText(`Select ${demoFilterString?.label} field`) //Select name field
      ) as HTMLElement;
      const filterInput: HTMLInputElement = within(filterStringItem).getByRole('textbox');
      await UserEvent.click(filterInput);
      const newFilterData = cloneDeep(demoFilterString);
      const newVal = 'e';
      await UserEvent.type(filterInput, newVal);
      newFilterData.value = `${newFilterData.value}${newVal}`;
      expect(updateFilter).toHaveBeenCalledWith(0, newFilterData);
    });
    test('should call update filter when modifying number filter data', async () => {
      const filterListItems = screen.getAllByRole('listitem');
      const filterNumberItem = filterListItems.find(
        (f) => within(f).queryByLabelText(`Select ${demoFilterNumber?.label} field`) //Select name field
      ) as HTMLElement;
      const filterInput: HTMLInputElement = within(filterNumberItem).getByRole('spinbutton');
      await UserEvent.click(filterInput);
      await UserEvent.clear(filterInput);
      await waitFor(() => filterInput.value === '');
      const newFilterData = cloneDeep(demoFilterNumber);
      newFilterData.value = 0;
      expect(updateFilter).toHaveBeenCalledWith(1, newFilterData);

      const newVal = '1';
      await UserEvent.type(filterInput, newVal);
      newFilterData.value = 1;
      expect(updateFilter).toHaveBeenCalledWith(1, newFilterData);
    });
    test('should call update filter with changed operator when using operator dropdown', async () => {
      const filterListItems = screen.getAllByRole('listitem');
      const filterNumberItem = filterListItems.find(
        (f) => within(f).queryByLabelText(`Select ${demoFilterNumber?.label} field`) //Select name field
      ) as HTMLElement;
      const operatorSelect: HTMLSelectElement = within(filterNumberItem).getByLabelText(
        `Select ${demoFilterNumber?.label} operator`
      );
      expect(operatorSelect.value).toEqual('>');
      await UserEvent.selectOptions(operatorSelect, comparisons.equals);
      expect(updateOperator).toHaveBeenCalledWith(1, comparisons.equals);
    });
    test('should call updateFieldTarget if filter field is changed', async () => {
      const filterListItems = screen.getAllByRole('listitem');
      const filterNumberItem = filterListItems.find(
        (f) => within(f).queryByLabelText(`Select ${demoFilterNumber?.label} field`) //Select name field
      ) as HTMLElement;
      const fieldSelect: HTMLSelectElement = within(filterNumberItem).getByLabelText(
        `Select ${demoFilterNumber?.label} field`
      );
      expect(fieldSelect.value).toEqual('count');
      await UserEvent.selectOptions(fieldSelect, demoFieldsData.filterB.label);

      expect(updateFieldTarget).toHaveBeenCalledWith(1, demoFieldsData.filterB.uid);
    });
    test('should allow custom field types', async () => {
      const filterListItems = screen.getAllByRole('listitem');
      const filterStringItem = filterListItems.find(
        (f) => within(f).queryByLabelText(`Select ${demoFilterCustom?.label} field`) //Select name field
      ) as HTMLElement;
      const customFilterComponent = within(filterStringItem).getByTestId('customFilter');
      const filterButton: HTMLInputElement = within(customFilterComponent).getByRole('button');
      await UserEvent.click(filterButton);
      const newFilterData = cloneDeep(demoFilterCustom);
      newFilterData.value = 'button clicked';
      expect(updateFilter).toHaveBeenCalledWith(3, newFilterData);
    });
    test('should be able to add a filter', async () => {
      const newFilterBtn = screen.getByRole('button', { name: /Add Filter/ });
      await UserEvent.click(newFilterBtn);
      const newFilter = new FilterObjectClass({
        ...demoFilterString,
        uid: expect.any(String),
        label: 'Name',
        operator: EComparisons.EQUALS,
        value: undefined,
      });
      expect(addFilter).toHaveBeenCalledWith(newFilter);
    });
    test('should be able to change filter field to custom field', async () => {
      const filterListItems = screen.getAllByRole('listitem');
      const filterStringItem = filterListItems.find(
        (f) => within(f).queryByLabelText(`Select ${demoFilterString?.label} field`) //Select name field
      ) as HTMLElement;
      const filterFieldSelect: HTMLInputElement = within(filterStringItem).getByLabelText(
        `Select ${demoFilterString?.label} field`
      );
      await UserEvent.selectOptions(filterFieldSelect, customField.label);
      expect(updateFieldTarget).toHaveBeenCalledWith(0, customField.uid);
    });
    test('should be able to have seperate field and data field', () => {
      // This is useful if we need to pass a different search field id to the field we get the filter data from
    });
  });
  describe('Integration Tests', () => {
    beforeEach(() => {
      render(<compositions.FilterManagerWithText />);
    });
    test('should show a filter for each filter item', () => {
      const filterCount = demoFiltersCopy.length;
      const filterListItems = screen.getAllByRole('listitem');
      expect(filterListItems.length).toBeGreaterThan(0);
      expect(filterListItems.length).toEqual(filterCount);
    });

    test('Entering text into a string filter will update the value in the filter data', async () => {
      const filterListItems = screen.getAllByRole('listitem');
      const filterStringItem = filterListItems.find(
        (f) => within(f).queryByLabelText(`Select ${demoFilterString?.label} field`) //Select name field
      ) as HTMLElement;
      const filterInput: HTMLInputElement = within(filterStringItem).getByRole('textbox');
      await UserEvent.click(filterInput);
      await UserEvent.clear(filterInput);
      const newFilterData = cloneDeep(demoFilterString);
      const newVal = 'abc';
      await UserEvent.type(filterInput, newVal);
      newFilterData.value = `${newFilterData.value}${newVal}`;
      expect(filterInput.value).toEqual(newVal);
    });
    test('should call update filter when modifying number filter data', async () => {
      const filterListItems = screen.getAllByRole('listitem');
      const filterNumberItem = filterListItems.find(
        (f) => within(f).queryByLabelText(`Select ${demoFilterNumber?.label} field`) //Select name field
      ) as HTMLElement;
      const filterInput: HTMLInputElement = within(filterNumberItem).getByRole('spinbutton');
      await UserEvent.click(filterInput);
      await UserEvent.clear(filterInput);
      await waitFor(() => filterInput.value === '');
      const newFilterData = cloneDeep(demoFilterNumber);
      newFilterData.value = 0;
      expect(filterInput.value).toEqual('0');

      const newVal = '123';
      await UserEvent.type(filterInput, newVal);
      newFilterData.value = 1;
      expect(filterInput.value).toEqual(newVal);
    });
    test('should call update filter with changed operator when using operator dropdown', async () => {
      const filterListItems = screen.getAllByRole('listitem');
      const filterNumberItem = filterListItems.find(
        (f) => within(f).queryByLabelText(`Select ${demoFilterNumber?.label} field`) //Select name field
      ) as HTMLElement;
      const operatorSelect: HTMLSelectElement = within(filterNumberItem).getByLabelText(
        `Select ${demoFilterNumber?.label} operator`
      );
      expect(operatorSelect.value).toEqual('>');
      await UserEvent.selectOptions(operatorSelect, comparisons.equals);
      expect(operatorSelect.value).toEqual(comparisons.equals);
    });
    test('should call updateFieldTarget if filter field is changed', async () => {
      expect(screen.queryByDisplayValue(demoFieldsData.filterB.label)).not.toBeInTheDocument();
      const filterListItems = screen.getAllByRole('listitem');
      const filterNumberItem = filterListItems.find(
        (f) => within(f).queryByLabelText(`Select ${demoFilterNumber?.label} field`) //Select name field
      ) as HTMLElement;
      const fieldSelect: HTMLSelectElement = within(filterNumberItem).getByLabelText(
        `Select ${demoFilterNumber?.label} field`
      );
      expect(fieldSelect.value).toEqual('count');
      await UserEvent.selectOptions(fieldSelect, demoFieldsData.filterB.label);
      await waitFor(() => fieldSelect.value === demoFieldsData.filterB.uid);
      await waitFor(() => screen.getByDisplayValue(demoFieldsData.filterB.label));
      const newFilter = await screen.findByDisplayValue(demoFieldsData.filterB.label);
      expect(newFilter).toBeInTheDocument();
    });
    test('should be able to add a filter', async () => {
      const newFilterBtn = screen.getByRole('button', { name: /Add Filter/ });
      await UserEvent.click(newFilterBtn);
      const filterListItems = screen.getAllByRole('listitem');
      expect(filterListItems.length).toEqual(demoFiltersCopy.length + 1);
    });
    test('should be able to change filter field to custom field', async () => {
      const filterListItems = screen.getAllByRole('listitem');
      const filterFieldSelect: HTMLInputElement = within(filterListItems[0]).getByLabelText(
        `Select ${demoFilterString?.label} field`
      );
      await UserEvent.selectOptions(filterFieldSelect, customField.label);
      await within(screen.getAllByRole('listitem')[0]).findByText('Custom Filter Component');
    });
  });
});
