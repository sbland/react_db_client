import React from 'react';
import DataTableWrapper from './DataTableWrapper';
import {
  demoTableData,
  demoHeadingsData,
  demoTableDataSimple,
  demoHeadingsDataSimple,
  demoTableDataLong,
  CustomField,
  customFilter,
} from './demoData';
import { dataTableDefaultConfig } from './DataTableConfig/DataTableConfig';
// import { FilterTypes } from '@react_db_client/components.filter-manager';
import DataTableCellNumber from './CellTypes/DataTableCellNumber';

const DEMO_TABLE_DATA = Object.values(demoTableData);

const DEMO_CONFIG = { ...dataTableDefaultConfig, allowSelection: true };
const DEMO_SORT_BY = { heading: 'count', direction: 1, map: null };

const DEMO_HEADINGS = demoHeadingsData;
const customFieldComponents = {
  custom: CustomField,
  customeval: DataTableCellNumber,
};
const customFilters = {
  custom: customFilter,
};
const customFiltersComponents = { custom: () => "CUSTOM" };
// const customFiltersComponents = { custom: FilterTypes.FilterNumber };

const defaultProps = {
  data: DEMO_TABLE_DATA,
  headings: DEMO_HEADINGS,
  config: DEMO_CONFIG,
  sortByOverride: DEMO_SORT_BY,
  saveData: console.log,
  calculateTotals: true,
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
