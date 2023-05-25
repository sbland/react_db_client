import React from 'react';
import DataTableWrapper, { IDataTableWrapperProps } from './DataTableWrapper';
import {
  demoTableData,
  demoHeadingsData,
  CustomField,
  customFilter,
  availableFilters,
  evaluationTableHeadings,
  demoTableDataEvaluationTable,
} from './demoData';
import { dataTableDefaultConfig, IDataTableConfig } from './DataTableConfig/DataTableConfig';
import DataTableCellNumber from './CellTypes/DataTableCellNumber';
import { saveData } from './test-utils/mock-api';

const DEMO_CONFIG = {
  ...dataTableDefaultConfig,
  allowSelection: true,
  calculateTotals: true,
};

const DEMO_HEADINGS = demoHeadingsData;
const customFieldComponents = {
  custom: CustomField,
  customeval: DataTableCellNumber,
};
const customFilters = {
  custom: customFilter,
};
const customFiltersComponents = { custom: () => 'CUSTOM' };

const CompositionWrap = (props) => {
  const [autosave, setAutosave] = React.useState(props.autoSave);
  return (
    <div>
      <div>
        <button
          style={{ background: autosave ? 'green' : 'red' }}
          onClick={() => setAutosave(!autosave)}
        >
          Toggle autosave
        </button>
      </div>
      <div>
        <DataTableWrapper {...props} autoSave={autosave} />
      </div>
    </div>
  );
};

const defaultProps: IDataTableWrapperProps & { config: Partial<IDataTableConfig> } = {
  id: 'Demo table',
  data: demoTableData,
  headings: DEMO_HEADINGS,
  availableFilters,
  config: DEMO_CONFIG,
  saveData: saveData,
  styleOverride: { background: 'green' },
  errorStyleOverride: { DUPLICATE: { background: 'red' }, MISSING: { background: 'orange' } },
  onSelectionChange: (newSelection) => {
    console.log(newSelection);
  },
  customFieldComponents,
  customFilters,
  customFiltersComponents,
  maxTableHeight: 2000,
};

export const BasicDataTableWrapper = () => <CompositionWrap {...defaultProps} />;

const calculatingTableProps: IDataTableWrapperProps & { config: Partial<IDataTableConfig> } = {
  ...defaultProps,
  headings: evaluationTableHeadings,
  data: demoTableDataEvaluationTable,
  config: {
    ...DEMO_CONFIG,
    hasBtnsColumn: false,
  },
};

export const CalculatedDataTableWrapper = () => <CompositionWrap {...calculatingTableProps} />;
