/* eslint-disable react/prop-types */
import React, { useEffect, useMemo } from 'react';
import {
  EComparisons,
  EFilterType,
  FilterObjectClass,
  FilterOption,
  Uid,
} from '@react_db_client/constants.client-types';
import { IHeadingCustomExample, THeading } from './lib';

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

export const demoTableDataSimple = [
  {
    uid: 'a',
    name: 'Foo',
    count: 4,
  },
  {
    uid: 'b',
    name: 'Bar',
    count: 3,
  },
  {
    uid: 'c',
    name: 'Roo',
    count: -100,
  },
  {
    uid: 'd',
    name: 'Foo',
    count: 2,
  },
  {
    uid: 'e',
    name: '',
    count: 2,
  },
];

// The demo data after filter, sort and evaluate
export const demoTableDataEvaluatedSimple = [
  {
    uid: 'd',
    name: 'Foo',
    count: 2,
    eval: 3,
  },
  {
    uid: 'a',
    name: 'Foo',
    count: 4,
    eval: 5,
  },
];

export const demoHeadingsDataSimple = [
  {
    uid: 'uid',
    label: 'UID',
    type: 'button',
    action: (x) => alert(x),
  },
  {
    uid: 'name',
    label: 'Name',
    type: EFilterType.text,
  },
  {
    uid: 'count',
    label: 'Count',
    type: EFilterType.number,
    defaultValue: 7,
    step: 1,
  },
  {
    uid: 'eval',
    label: 'Eval',
    evaluateType: EFilterType.number,
    type: EFilterType.number,
    expression: '$count + 1',
    expressionReversed: '$count=$_ - 1',
  },
  {
    uid: 'select',
    label: 'Select',
    type: 'select',
    options: [
      { uid: 'a', label: 'A' },
      { uid: 'b', label: 'B' },
      { uid: 'c', label: 'C' },
    ],
  },
  {
    uid: 'hidden',
    label: 'Hidden',
    type: 'text',
    hidden: true,
  },
];

export const demoHeadingsSimpleHiddenIds = demoHeadingsDataSimple
  .filter((h) => h.hidden)
  .map((h) => h.uid);

export const demoDataSimpleTotals = {
  count: 7,
};

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

export const demoTableDataLong = [...Array(100)]
  .map((v, i) => ({
    uid: i,
    name: 'Foo',
    count: 3,
    multiplier: 2,
    toggle: true,
    readOnly: "Can't touch me",
    select: 'a',
  }))
  .reduce((acc, v) => {
    acc[v.uid] = v;
    return acc;
  }, {});

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

export const demoHeadingsData: THeading<IHeadingCustomExample>[] = [
  {
    uid: 'uid',
    label: 'UID',
    type: EFilterType.button,
    action: (x) => alert(x),
    styleRule: '$count<5',
    unique: true,
    required: true,
  },
  {
    uid: 'name',
    label: 'Name',
    type: EFilterType.text,
    unique: true,
    required: true,
  },
  {
    uid: 'description',
    label: 'description',
    type: EFilterType.textLong,
  },
  {
    uid: 'count',
    label: 'Count',
    type: EFilterType.number,
    max: 10,
    min: 2,
    defaultValue: 8,
    step: 1,
    showTotals: true,
  },
  {
    uid: 'def',
    label: 'Def',
    type: EFilterType.number,
    max: 10,
    min: 1,
    defaultValue: 7,
    showTotals: true,
  },
  {
    uid: 'multiplier',
    label: 'Multiplier',
    type: EFilterType.number,
    max: 10,
    min: 1,
    // defaultValue: '$def', // NOT IMPLEMENTED
  },
  {
    uid: 'readOnly',
    label: 'Read Only',
    type: EFilterType.text,
    readOnly: true,
  },
  {
    uid: 'hiddenDemo',
    label: 'Hidden',
    type: EFilterType.text,
    hidden: true,
  },
  {
    uid: 'hiddenDemoNumber',
    label: 'Hidden Number',
    type: EFilterType.number,
    hidden: true,
  },
  {
    uid: 'toggle',
    label: 'Toggle',
    type: EFilterType.toggle,
  },
  {
    uid: 'toggleR',
    label: 'ToggleR',
    type: EFilterType.toggle,
    readOnly: true,
  },
  {
    uid: 'expression',
    label: 'Expression',
    type: EFilterType.number,
    evaluateType: EFilterType.number,
    expression: '$count * $multiplier',
    expressionReversed: '$count=$_ / $multiplier',
    // expressionReversed: '$count * $multiplier',
    showTotals: true,
  },
  {
    uid: 'validated',
    label: 'Is Validated',
    evaluateType: EFilterType.text,
    type: EFilterType.bool,
    operator: EComparisons.EQUALS,
    target: 'a',
    field: 'select',
    invert: true,
  },
  {
    uid: 'invalid',
    label: 'Invalid',
    evaluateType: EFilterType.number,
    type: EFilterType.number,
    expression: '$nothing',
    expressionReversed: '$nothing',
  },
  {
    uid: 'invalidb',
    label: 'InvalidB',
    type: EFilterType.number,
    evaluateType: EFilterType.number,
    expression: '$invalid * 2',
    expressionReversed: '$invalid / 2',
  },
  {
    uid: 'select',
    label: 'Select',
    type: EFilterType.select,
    options: [
      { uid: 'a', label: 'A' },
      { uid: 'b', label: 'B' },
      { uid: 'c', label: 'C' },
    ],
  },
  {
    uid: 'internalRoom',
    label: 'Internal Room',
    type: EFilterType.reference,
    collection: 'rooms',
  },
  {
    uid: 'longHeading',
    label: 'Long Heading which is really really long',
    type: EFilterType.text,
  },
  {
    uid: 'customfield',
    label: 'Custom',
    type: 'custom',
    isCustomType: true,
    showTotals: true,
  },
  {
    uid: 'customfieldeval',
    label: 'Custom Eval',
    type: 'customeval',
    isCustomType: true,
    showTotals: true,
    expression: '$customfield + 1',
    expressionReversed: '$customfield=$_ - 1',
    evaluateType: EFilterType.number,
  },
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
    // readOnly: true,
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
    // readOnly: true,
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
export const customFilter = (value, expression, targetValue) => {
  if (Math.abs(value - targetValue) < 0.3) return true;
  return false;
};

// export const DemoTotalsWrapper = () => {
//   const [total, setTotal] = useState(null);
//   return (
//     <div>
//       <DataTable
//         tableData={demoTableData}
//         headingsData={demoHeadingsData}
//         handleSaveData={(data) => console.log(data)}
//         outputTotals={setTotal}
//         showTotals
//       />
//       <h3>Totals</h3>
//       <p className="total">{JSON.stringify(total)}</p>
//     </div>
//   );
// };

export const availableFilters = demoHeadingsData.reduce(
  (acc, h) => ({ ...acc, [h.uid]: new FilterOption({ ...h, field: h.field || h.uid }) }),
  {} as { [k: Uid]: FilterOption }
);
