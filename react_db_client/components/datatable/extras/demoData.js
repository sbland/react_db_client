/* eslint-disable react/prop-types */
import React, { useEffect, useMemo } from 'react';
import {
  comparisons,
  filterTypes,
  FilterObjectClass,
} from '@react_db_client/constants.client-types';

export const demoFilterString = new FilterObjectClass({
  uid: 'demoFilterString',
  field: 'name',
  value: 'Foo',
  label: 'Demo Filter String',
  operator: comparisons.contains,
  type: filterTypes.text,
});
export const demoFilterNumber = new FilterObjectClass({
  uid: 'demoFilterNumber',
  field: 'count',
  label: 'Demo Filter Number',
  value: 0,
  step: 1,
  operator: comparisons.greaterThan,
  type: filterTypes.number,
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
  operator: comparisons.contains,
  type: filterTypes.select,
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
    type: filterTypes.text,
  },
  {
    uid: 'count',
    label: 'Count',
    type: filterTypes.number,
    defaultValue: 7,
    step: 1,
  },
  {
    uid: 'eval',
    label: 'Eval',
    evaluateType: 'number',
    type: filterTypes.number,
    expression: '$count + 1',
    expressionReversed: '$count=$_ - 1',
  },
];

export const demoHeadingsSimpleHiddenIds = demoHeadingsDataSimple
  .filter((h) => h.hidden)
  .map((h) => h.uid);

export const demoDataSimpleTotals = {
  count: 7,
};

export const demoTableData = {
  a: {
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
    objref: {
      _id: 1,
      label: 'Ref A',
      uid: 'a',
    },
  },
  ab: {
    // Note string "4" here to check we can pass string numbers without issues
    uid: 'ab',
    natid: '10a',
    name: 'Foobar',
    count: '99',
    def: 3,
    hiddenDemoNumber: 3,
    hiddenDemo: 'Hide me',
  },
  b: {
    uid: 'b',
    natid: '50a',
    name: 'Bar',
    description: 'A really really really long description that needs to fit into a little box!',
    hiddenDemoNumber: 3,
    hiddenDemo: 'Hide me',
  },
  c: {
    uid: 'c',
    name: 'C',
    count: 3,
    multiplier: 3,
    expression: 9,
    hiddenDemoNumber: 3,
    hiddenDemo: 'Hide me',
  },
  d: {
    uid: 'd',
    name: '',
    hiddenDemoNumber: 3,
    hiddenDemo: 'Hide me',
  },
};

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

export const demoHeadingsData = [
  {
    uid: 'uid',
    label: 'UID',
    type: 'button',
    action: (x) => alert(x),
    styleRule: '$count<5',
    unique: true,
    required: true,
  },
  {
    uid: 'name',
    label: 'Name',
    type: 'text',
    unique: true,
    required: true,
  },
  {
    uid: 'description',
    label: 'description',
    type: 'textLong',
  },
  {
    uid: 'count',
    label: 'Count',
    type: 'number',
    max: 10,
    min: 2,
    def: 8,
    step: 1,
    showTotals: true,
  },
  {
    uid: 'def',
    label: 'Def',
    type: 'number',
    max: 10,
    min: 1,
    defaultValue: 7,
    showTotals: true,
  },
  {
    uid: 'multiplier',
    label: 'Multiplier',
    type: 'number',
    max: 10,
    min: 1,
    def: '$def',
  },
  {
    uid: 'readOnly',
    label: 'Read Only',
    type: 'text',
    readOnly: true,
  },
  {
    uid: 'hiddenDemo',
    label: 'Hidden',
    type: 'text',
    hidden: true,
  },
  {
    uid: 'hiddenDemoNumber',
    label: 'Hidden Number',
    type: 'number',
    hidden: true,
  },
  {
    uid: 'toggle',
    label: 'Toggle',
    type: 'toggle',
  },
  {
    uid: 'toggleR',
    label: 'ToggleR',
    type: 'toggle',
    readOnly: true,
  },
  {
    uid: 'expression',
    label: 'Expression',
    type: 'number',
    evaluateType: 'number',
    expression: '$count * $multiplier',
    expressionReversed: '$count=$_ / $multiplier',
    reverseExpression: '$count * $multiplier',
    showTotals: true,
  },
  {
    uid: 'validated',
    label: 'Is Validated',
    evaluateType: 'string',
    type: 'string',
    operator: comparisons.equals,
    target: 'a',
    field: 'select',
    invert: true,
  },
  {
    uid: 'invalid',
    label: 'Invalid',
    evaluateType: 'number',
    type: 'number',
    expression: '$nothing',
  },
  {
    uid: 'invalidb',
    label: 'InvalidB',
    type: 'number',
    evaluateType: 'number',
    expression: '$invalid * 2',
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
    uid: 'internalRoom',
    label: 'Internal Room',
    type: 'entity',
    collection: 'rooms',
  },
  {
    uid: 'longHeading',
    label: 'Long Heading which is really really long',
    type: 'entity',
    collection: 'rooms',
  },
  {
    uid: 'customfield',
    label: 'Custom',
    type: 'custom',
    isCustom: true,
    showTotals: true,
  },
  {
    uid: 'customfieldeval',
    label: 'Custom Eval',
    type: 'customeval',
    isCustom: true,
    showTotals: true,

    expression: '$customfield + 1',
    expressionReversed: '$customfield=$_ - 1',
    evaluateType: 'number',
  },
  {
    uid: 'objref',
    label: 'Object Ref',
    type: filterTypes.reference,
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
export const customFilter = (value, expression, targetValue, item) => {
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
