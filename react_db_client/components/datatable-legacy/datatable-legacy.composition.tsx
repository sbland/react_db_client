import React from 'react';
import { Uid } from '@react_db_client/constants.client-types';
import DataTableWrapper, { IDataTableWrapperProps } from './DataTableWrapper';
import {
  demoTableData,
  demoHeadingsData,
  CustomField,
  customFilter,
  availableFilters,
  evaluationTableHeadings,
  demoTableDataEvaluationTable,
  headingExampleNumber,
  headingExampleText,
  generateDemoTableDataFilteredByColumns,
} from './demoData';
import { dataTableDefaultConfig, IDataTableConfig } from './DataTableConfig/DataTableConfig';
import DataTableCellNumber from './CellTypes/DataTableCellNumber';
import { saveData } from './test-utils/mock-api';
import { THeading } from './lib';

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

const CompositionWrap = (props: IDataTableWrapperProps) => {
  const [autosave, setAutosave] = React.useState(props.autoSave);
  const [debugMode, setDebugMode] = React.useState(false);
  const [managed, setManaged] = React.useState(false);
  const [data, setData] = React.useState(props.data);
  const [useLocalData, setUseLocalData] = React.useState(false);

  const saveDataControlled = (data, action: string, newData?, rowId?: Uid, colIds?: Uid[]) => {
    setData(data);
  };

  React.useEffect(() => {
    setData(props.data);
  }, [props.data]);

  const propsMiddle: IDataTableWrapperProps = {
    ...props,
    autoSave: autosave,
    isControlled: managed,
    saveData: managed || useLocalData ? saveDataControlled : props.saveData,
    data: managed ? data : props.data,
  };

  const config = { ...DEMO_CONFIG, debugMode };

  return (
    <div>
      <div>
        {/* Toggle autosave btn */}
        <button
          style={{ background: autosave ? 'green' : 'red' }}
          onClick={() => setAutosave(!autosave)}
        >
          Toggle autosave
        </button>
        {/* Toggle debugStateBtn btn */}
        <button
          style={{ background: debugMode ? 'green' : 'red' }}
          onClick={() => setDebugMode(!debugMode)}
        >
          Toggle debugMode
        </button>
        {/* Toggle managed btn */}
        <button
          style={{ background: managed ? 'green' : 'red' }}
          onClick={() => setManaged(!managed)}
        >
          Toggle managed
        </button>
        {/* Toggle useLocalData btn */}
        <button
          style={{ background: useLocalData ? 'green' : 'red' }}
          onClick={() => setUseLocalData(!useLocalData)}
        >
          Toggle useLocalData
        </button>
        {/* reset data btn */}
        <button onClick={() => setData(props.data)}>Reset data</button>
      </div>
      <div>
        <DataTableWrapper {...propsMiddle} config={config} />
      </div>
      <div>{useLocalData && <DataTableWrapper {...propsMiddle} data={data} config={config} />}</div>
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
  maxTableHeight: 300,
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

export const DataTableWrapperForTests = () => {
  const [headings, setHeadings] = React.useState<THeading[]>([headingExampleNumber]);
  const [data, setData] = React.useState(
    generateDemoTableDataFilteredByColumns(1, headings) as any
  );

  React.useEffect(() => {
    setData(generateDemoTableDataFilteredByColumns(1, headings) as any);
  }, [headings]);

  return (
    <>
      {/* Restrict headings to heading at index */}
      <div>
        <button onClick={() => setHeadings([headingExampleNumber])}>Number Column Only</button>
        <button onClick={() => setHeadings([headingExampleText])}>Text Column Only</button>
        {/* Reset headings */}
        <button onClick={() => setHeadings(DEMO_HEADINGS)}>Reset headings</button>
        {/* Set data with generatedTableData */}
        <button onClick={() => setData(generateDemoTableDataFilteredByColumns(1, headings) as any)}>
          Generate 1 row
        </button>
        <button onClick={() => setData(generateDemoTableDataFilteredByColumns(2, headings) as any)}>
          Generate 2 rows
        </button>
        <button
          onClick={() => setData(generateDemoTableDataFilteredByColumns(100, headings) as any)}
        >
          Generate 100 rows
        </button>
      </div>
      <CompositionWrap {...calculatingTableProps} headings={headings} data={data} />
    </>
  );
};
