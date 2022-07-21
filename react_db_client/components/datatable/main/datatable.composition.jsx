import React from 'react';
import {
  DEMO_TABLE_DATA,
  DEMO_TABLE_DATA_GRID,
  DEMO_HEADINGS,
  DEMO_HEADINGS_GRID,
  DEMO_TABLE_DATA_LARGE,
} from '@samnbuk/react_db_client.components.datatable.extras';
import { dataTableDefaultConfig } from '@samnbuk/react_db_client.components.datatable.config';
import { defaultComponentMap } from '@samnbuk/react_db_client.components.datatable.cell-types';
import { CompositionWrapDefault } from '@react_db_client/helpers.composition-wraps';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '@samnbuk/react_db_client.components.datatable.style';
import { DataTable } from './datatable';

const DEMO_CONFIG = { ...dataTableDefaultConfig, allowSelection: true };

const defaultProps = {
  data: DEMO_TABLE_DATA,
  headings: DEMO_HEADINGS,
  config: DEMO_CONFIG,
  componentMap: defaultComponentMap(),
  // sortByOverride: DEMO_SORT_BY,
  // saveData: console.log,
  // calculateTotals: true,
  // styleOverride: { background: 'green' },
  // errorStyleOverride: { DUPLICATE: { background: 'red' }, MISSING: { background: 'orange' } },
  // onSelectionChange: (newSelection) => {
  //   // alert('Selection changed');
  //   console.log(newSelection);
  // },
  // customFieldComponents,
  // customFilters,
  // customFiltersComponents,
  // maxTableHeight: 2000,
};

const ComponentWrap = ({ children }) => (
  <CompositionWrapDefault width="16rem" height="16rem" horizontal>
    <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
  </CompositionWrapDefault>
);

export const BasicDatatable = () => (
  <ComponentWrap>
    <DataTable {...defaultProps} />
  </ComponentWrap>
);

export const BasicStressTest = () => (
  <ComponentWrap>
    <DataTable
      {...defaultProps}
      data={DEMO_TABLE_DATA_LARGE}
      config={{ ...defaultProps.config, speedUpScrolling: true }}
      rowHeight={25}
    />
  </ComponentWrap>
);

export const DatatableForTests = () => (
  <ComponentWrap>
    <DataTable
      {...defaultProps}
      data={DEMO_TABLE_DATA_GRID(10)}
      headings={DEMO_HEADINGS_GRID}
      speedUpScrolling
    />
  </ComponentWrap>
);
export const DatatableForTestsStressTest = () => (
  <ComponentWrap>
    <DataTable
      {...defaultProps}
      data={DEMO_TABLE_DATA_GRID(1000)}
      headings={DEMO_HEADINGS_GRID}
      speedUpScrolling
    />
  </ComponentWrap>
);
