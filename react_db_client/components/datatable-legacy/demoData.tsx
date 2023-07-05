/* eslint-disable react/prop-types */
import React, { useEffect, useMemo } from 'react';
import {
  EComparisons,
  EFilterType,
  EOperator,
  FilterObjectClass,
  FilterOption,
  Uid,
} from '@react_db_client/constants.client-types';
import { TCustomFilter } from '@react_db_client/helpers.filter-helpers';
import { IFilterComponentProps } from '@react_db_client/components.filter-manager';
import DataTableCellNumber from './CellTypes/DataTableCellNumber';
import { EValidationType, IHeadingCustomExample, THeading } from './lib';

/* Example Filters */
export const demoFilterString = new FilterObjectClass({
  uid: 'demoFilterString',
  field: 'name',
  value: 'Foo',
  label: 'Demo Filter String',
  operator: EComparisons.CONTAINS,
  type: EFilterType.text,
});
export const demoFilterNumber = new FilterObjectClass({
  uid: 'demoFilterNumber',
  field: 'count',
  label: 'Demo Filter Number',
  value: 0,
  // step: 1,
  operator: EComparisons.GREATER_THAN,
  type: EFilterType.number,
});
// export const demoFilterExpression = new FilterObjectClass({
//   uid: 'demoFilterExpression',
//   field: 'expression',
//   label: 'Demo Filter Expression',
//   value: 0,
//   operator: '>',
// });

export const demoFilterSelect = new FilterObjectClass({
  uid: 'demoFilterExpression',
  field: 'select',
  label: 'Demo Filter Select',
  value: 'a',
  operator: EComparisons.CONTAINS,
  type: EFilterType.select,
});

export const demoFiltersData = [demoFilterString, demoFilterNumber];

export const demoTableData = [
  {
    uid: 'a',
    natid: '100a',
    name: 'Foo',
    count: 3,
    multiplier: 2,
    toggle: true,
    readOnly: "Can't touch me",
    select: 'a',
    hiddenDemoNumber: 3,
    hiddenDemo: 'Hide me',
  },
  {
    // Note string "4" here to check we can pass string numbers without issues
    uid: 'ab',
    natid: '10a',
    name: 'Foobar',
    count: '99',
    def: 3,
    hiddenDemoNumber: 3,
    hiddenDemo: 'Hide me',
  },
  {
    uid: 'b',
    natid: '50a',
    name: 'Bar',
    description: 'A really really really long description that needs to fit into a little box!',
    hiddenDemoNumber: 3,
    hiddenDemo: 'Hide me',
  },
  {
    uid: 'c',
    name: 'C',
    count: 3,
    multiplier: 3,
    expression: 9,
    hiddenDemoNumber: 3,
    hiddenDemo: 'Hide me',
  },
  {
    uid: 'd',
    name: '',
    hiddenDemoNumber: 3,
    hiddenDemo: 'Hide me',
  },
];

/* Expected initial values in totals row */
export const demoTotals = {
  uid: 'na',
  name: 'na',
  count: 10,
  multiplier: 10,
  toggle: 'na',
  readOnly: 'na',
  select: 'na',
  hiddenDemoNumber: 8,
  hiddenDemo: 'na',
};

// export const demoTableData = Object.values(demoTableDataObject);

export const demoTableDataEvaluated = [
  {
    count: 3,
    // def: 3,
    hiddenDemoNumber: 3,
    expression: 6,
    multiplier: 2,
    hiddenDemo: 'Hide me',
    name: 'Foo',
    toggle: true,
    uid: 'a',
    validated: false,
    invalid: 'INVALID',
    invalidb: 'INVALID',
    readOnly: "Can't touch me",
    select: 'a',
  },
  {
    count: 4,
    hiddenDemoNumber: 3,
    def: 3,
    hiddenDemo: 'Hide me',
    expression: 'INVALID',
    invalid: 'INVALID',
    invalidb: 'INVALID',
    name: 'Foobar',
    uid: 'ab',
    validated: 'INVALID',
  },
];

export const demoTableTotals = {
  count: 7,
  def: 3,
  expression: 6,
  hiddenDemoNumber: 6,
  multiplier: 2,
  invalid: 0,
  invalidb: 0,
};

export const demoProcessedData = {
  tableDataFiltered: demoTableDataEvaluated,
  totals: demoTableTotals,
};

export const headingExampleButton = {
  uid: 'uid',
  label: 'UID',
  type: EFilterType.button,
  action: (x) => alert(x),
  styleRule: '$count<5',
  unique: true,
  required: true,
};

export const headingExampleText = {
  uid: 'name',
  label: 'Name',
  type: EFilterType.text,
  unique: true,
  required: true,
  width: 200,
};

export const headingExampleTextLong = {
  uid: 'description',
  label: 'description',
  type: EFilterType.textLong,
};

export const headingExampleNumber = {
  uid: 'count',
  label: 'Count',
  type: EFilterType.number,
  max: 10,
  min: 2,
  defaultValue: 8,
  step: 1,
  showTotals: true,
};

/* This column will be invalid if the value is greater than the value of the count column */
export const headingExampleNumberValidatedLinked = {
  uid: 'countValidatedLinked',
  label: 'Count Validated',
  type: EFilterType.number,
  step: 1,
  showTotals: true,
  validationRules: ['$countValidatedLinked<$count'],
  validationMessage: 'Must be less than count',
  validationType: EValidationType.ERROR,
};

export const headingExampleNumberDef = {
  uid: 'def',
  label: 'Def',
  type: EFilterType.number,
  max: 10,
  min: 1,
  defaultValue: 7,
  showTotals: true,
};

export const headingExampleNumberMultiplier = {
  uid: 'multiplier',
  label: 'Multiplier',
  type: EFilterType.number,
  max: 10,
  min: 1,
  // defaultValue: '$def', // NOT IMPLEMENTED
};

export const headingExampleReadOnly = {
  uid: 'readOnly',
  label: 'Read Only',
  type: EFilterType.text,
  readOnly: true,
};

export const headingExampleHidden = {
  uid: 'hiddenDemo',
  label: 'Hidden',
  type: EFilterType.text,
  hidden: true,
};

export const headingExampleHiddenNumber = {
  uid: 'hiddenDemoNumber',
  label: 'Hidden Number',
  type: EFilterType.number,
  hidden: true,
};

export const headingExampleToggle = {
  uid: 'toggle',
  label: 'Toggle',
  type: EFilterType.toggle,
};

export const headingExampleToggleR = {
  uid: 'toggleR',
  label: 'ToggleR',
  type: EFilterType.toggle,
  readOnly: true,
};

export const headingExampleExpression = {
  uid: 'expression',
  label: 'Expression',
  type: EFilterType.number,
  evaluateType: EFilterType.number,
  expression: '$count * $multiplier',
  expressionReversed: '$count=$_ / $multiplier',
  // expressionReversed: '$count * $multiplier',
  showTotals: true,
};

/* This column will be false if the field 'select' is not equal to 'a' */
export const headingExampleValidated = {
  uid: 'validated',
  label: 'Is Validated',
  evaluateType: EFilterType.text,
  type: EFilterType.bool,
  operator: EComparisons.EQUALS,
  target: 'a',
  field: 'select',
  invert: true,
};

// export const headingExampleInvalid = {
//   uid: 'invalid',
//   label: 'Invalid',
//   evaluateType: EFilterType.number,
//   type: EFilterType.number,
//   expression: '$nothing',
//   expressionReversed: '$nothing',
// };

// export const headingExampleInvalidLinked = {
//   uid: 'invalidb',
//   label: 'InvalidB',
//   type: EFilterType.number,
//   evaluateType: EFilterType.number,
//   expression: '$invalid * 2',
//   expressionReversed: '$invalid / 2',
// };

export const headingExampleSelect = {
  uid: 'select',
  label: 'Select',
  type: EFilterType.select,
  options: [
    { uid: 'a', label: 'A' },
    { uid: 'b', label: 'B' },
    { uid: 'c', label: 'C' },
  ],
};

export const headingExampleReference = {
  uid: 'referenceExample',
  label: 'Reference Example',
  type: EFilterType.reference,
  collection: 'referencecollection',
  searchFunction: async () => {
    return [{ uid: 'a', label: 'a' }];
  },
  headings: [
    {
      uid: 'uid',
      label: 'UID',
      type: EFilterType.text,
    },
    {
      uid: 'label',
      label: 'Label',
      type: EFilterType.text,
    },
  ],
};

export const headingExampleLongHeading = {
  uid: 'longHeading',
  label: 'Long Heading which is really really long',
  type: EFilterType.text,
};

export const headingExampleCustomField = {
  uid: 'customfield',
  label: 'Custom',
  type: 'custom',
  isCustomType: true,
  showTotals: true,
};

export const headingExampleCustomFieldEval = {
  uid: 'customfieldeval',
  label: 'Custom Eval',
  type: 'customeval',
  isCustomType: true,
  showTotals: true,
  expression: '$customfield + 1',
  expressionReversed: '$customfield=$_ - 1',
  evaluateType: EFilterType.number,
};

export const demoHeadingsData: THeading<IHeadingCustomExample>[] = [
  headingExampleButton,
  headingExampleText,
  headingExampleTextLong,
  headingExampleNumber,
  headingExampleNumberValidatedLinked,
  headingExampleNumberDef,
  headingExampleNumberMultiplier,
  headingExampleReadOnly,
  headingExampleHidden,
  headingExampleHiddenNumber,
  headingExampleToggle,
  headingExampleToggleR,
  headingExampleExpression,
  headingExampleValidated,
  // headingExampleInvalid,
  // headingExampleInvalidLinked,
  headingExampleSelect,
  headingExampleReference,
  headingExampleLongHeading,
  headingExampleCustomField,
  headingExampleCustomFieldEval,
];

export const demoTableDataEvaluationTable = [
  {
    uid: 'a',
    a: 1,
    b: 1,
    c: 1,
    count: 1,
    totalc: 1,
    d: 0,
    lineTotal: 1,
  },
  {
    uid: 'b',
    a: 2,
    b: 2,
    c: 4,
    count: 7,
    totalc: 8,
    d: 33.33,
    lineTotal: 14,
  },
];

export const evaluationTableHeadings = [
  {
    uid: 'uid',
    label: 'Id',
    type: 'text',
  },
  {
    uid: 'a',
    label: 'A',
    type: EFilterType.number,
    def: 1,
    step: 0.01,
  },
  {
    uid: 'b',
    label: 'B',
    type: EFilterType.number,
    def: '$b-default',
    step: 0.01,
  },
  {
    uid: 'c',
    label: 'C',
    evaluateType: EFilterType.number,
    type: EFilterType.number,
    expression: '$a + $b',
    expressionReversed: '$b=$_ - $a',
    step: 0.01,
  },
  {
    uid: 'count',
    label: 'Count',
    type: EFilterType.number,
    step: 1,
  },
  {
    uid: 'totalc',
    label: 'Total C',
    type: EFilterType.number,
    evaluateType: EFilterType.number,
    expression: '$count * $c',
    step: 0.01,
    showTotals: true,
    readOnly: true,
  },
];
export const CustomField = ({ acceptValue, cellData, editMode, focused }) => {
  const actionFunc = useMemo(() => {
    return () => acceptValue(Math.random());
  }, [acceptValue]);

  useEffect(() => {
    if (editMode && focused) {
      actionFunc();
    }
  }, [editMode, focused, actionFunc]);
  return (
    <div className="dataTableCellData dataTableCellData-button">
      <button type="button" onClick={actionFunc}>
        {cellData}
      </button>
    </div>
  );
};

// eslint-disable-next-line no-unused-vars
export const customFilter = (value, operator: EOperator, targetValue, item) => {
  if (item.toggle) return true;
  if (Math.abs(value - targetValue) < 0.3) return true;
  return false;
};

export const customAvailableFilter = new FilterOption({
  uid: 'customAvailableFilter',
  field: 'customfield',
  label: 'Custom Alt',
  type: 'custom',
  isCustomType: true,
});

export const availableFilters = {
  ...demoHeadingsData.reduce(
    (acc, h) => ({ ...acc, [h.uid]: new FilterOption({ ...h, field: h.field || h.uid }) }),
    {} as { [k: Uid]: FilterOption }
  ),
  customAvailableFilter,
};

export const generateDemoTableData = (count = 10) => {
  const data: Array<{}> = [];
  for (let i = 0; i < count; i++) {
    data.push({
      uid: `${i}`,
      name: `Name ${i}`,
      description: `Description ${i}`,
      count: i + 3,
      countValidatedLinked: 4,
      def: i,
      multiplier: i,
      readOnly: 'read only',
      hiddenDemo: 'hidden',
      hiddenDemoNumber: i,
      toggle: false,
      toggleR: true,
      expression: undefined, // isCalculated
      validated: undefined, // isCalculated
      invalid: undefined, // isCalculated
      invalidb: undefined, // isCalculated
      select: 'a',
      referenceExample: `${i}`,
      longHeading: `${i}`,
      customfield: i,
      customfieldeval: undefined, // isCalculated,
    });
  }
  return data;
};

export const generateDemoTableDataFilteredByColumns = (count = 10, headings: THeading[]) => {
  const columns = headings.map((h) => h.uid).concat(['uid']);
  const data = generateDemoTableData(count);
  return data.map((row) => {
    const newRow = {};
    columns.forEach((col) => {
      newRow[col] = row[col];
    });
    return newRow;
  });
};

export const customFieldComponents = {
  custom: CustomField,
  customeval: DataTableCellNumber,
};
export const customFilters: { [key: Uid]: TCustomFilter } = {
  custom: customFilter,
};

export const CustomFilterComponent = (props: IFilterComponentProps<any, boolean>) => (
  <div>
    <button
      onClick={() => props.updateFilter(new FilterObjectClass({ ...props.filter, value: 1.0 }))}
    >
      Set custom filter
    </button>
  </div>
);
export const customFiltersComponents: {
  [key: Uid]: React.FC<IFilterComponentProps<any, boolean>>;
} = {
  custom: CustomFilterComponent,
};
