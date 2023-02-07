import React from 'react';
import DataTableWrapper, { IDataTableWrapperProps } from './DataTableWrapper';
import {
  demoTableData,
  demoHeadingsData,
  CustomField,
  customFilter,
  availableFilters,
} from './demoData';
import { dataTableDefaultConfig, IDataTableConfig } from './DataTableConfig/DataTableConfig';
// import { FilterTypes } from '@react_db_client/components.filter-manager';
import DataTableCellNumber from './CellTypes/DataTableCellNumber';

const DEMO_CONFIG = {
  ...dataTableDefaultConfig,
  allowSelection: true,
  // allowFilters: false,
  // allowHiddenColumns: false,
  calculateTotals: true,
  // allowSelection: false,
};
const DEMO_SORT_BY = { heading: 'count', direction: 1, map: null };

const DEMO_HEADINGS = demoHeadingsData;
const customFieldComponents = {
  custom: CustomField,
  customeval: DataTableCellNumber,
};
const customFilters = {
  custom: customFilter,
};
const customFiltersComponents = { custom: () => 'CUSTOM' };
// const customFiltersComponents = { custom: FilterTypes.FilterNumber };

const defaultProps: IDataTableWrapperProps & { config: Partial<IDataTableConfig> } = {
  id: 'Demo table',
  data: demoTableData,
  headings: DEMO_HEADINGS,
  availableFilters,
  config: DEMO_CONFIG,
  sortByOverride: DEMO_SORT_BY,
  saveData: console.log,
  styleOverride: { background: 'green' },
  errorStyleOverride: { DUPLICATE: { background: 'red' }, MISSING: { background: 'orange' } },
  onSelectionChange: (newSelection) => {
    // alert('Selection changed');
    console.log(newSelection);
  },
  customFieldComponents,
  customFilters,
  customFiltersComponents,
  maxTableHeight: 2000,
};

export const BasicDataTableWrapper = () => <DataTableWrapper {...defaultProps} />;
