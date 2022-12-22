/* eslint-disable react/prop-types */
import React, { useEffect, useMemo } from 'react';
import { EFilterType, IDocument } from '@react_db_client/constants.client-types';
import { IHeadingButton, THeading } from '@form-extendable/lib';

export const demoHeadingsDataSimple: THeading<unknown>[] = [
  {
    uid: 'uid',
    label: 'UID',
    type: 'button',
    onClick: (x) => alert(x),
  } as IHeadingButton,
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
];

export const demoResults: { [k: string]: IDocument & any } = {
  a: {
    uid: 'a',
    label: 'a',
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
  ab: {
    // Note string "4" here to check we can pass string numbers without issues
    uid: 'ab',
    label: 'ab',
    natid: '10a',
    name: 'Foobar',
    count: '99',
    def: 3,
    hiddenDemoNumber: 3,
    hiddenDemo: 'Hide me',
  },
  b: {
    uid: 'b',
    label: 'b',
    natid: '50a',
    name: 'Bar',
    description: 'A really really really long description that needs to fit into a little box!',
    hiddenDemoNumber: 3,
    hiddenDemo: 'Hide me',
  },
  c: {
    uid: 'c',
    label: 'c',
    name: 'C',
    count: 3,
    multiplier: 3,
    expression: 9,
    hiddenDemoNumber: 3,
    hiddenDemo: 'Hide me',
  },
  d: {
    uid: 'd',
    label: 'd',
    name: '',
    hiddenDemoNumber: 3,
    hiddenDemo: 'Hide me',
  },
};

export const demoHeadingsData: THeading<unknown>[] = [
  {
    uid: 'uid',
    label: 'UID',
    type: EFilterType.button,
    onClick: () => alert(),
    required: true,
    group: 0,
  } as IHeadingButton,
  {
    uid: 'name',
    label: 'Name',
    type: EFilterType.text,
    required: true,
    group: 0,
  },
  // {
  //   uid: 'description',
  //   label: 'description',
  //   type: 'textLong',
  //   group: 1,
  // },
  // {
  //   uid: 'count',
  //   label: 'Count',
  //   type: 'number',
  //   max: 10,
  //   min: 2,
  //   def: 8,
  //   step: 1,
  //   showTotals: true,
  //   group: 3,
  // },
  // {
  //   uid: 'def',
  //   label: 'Def',
  //   type: 'number',
  //   max: 10,
  //   min: 1,
  //   defaultValue: 7,
  //   showTotals: true,
  //   group: 3,
  // },
  // {
  //   uid: 'multiplier',
  //   label: 'Multiplier',
  //   type: 'number',
  //   max: 10,
  //   min: 1,
  //   def: '$def',
  //   group: 4,
  // },
  // {
  //   uid: 'readOnly',
  //   label: 'Read Only',
  //   type: 'text',
  //   readOnly: true,
  //   group: 4,
  // },
  // {
  //   uid: 'hiddenDemo',
  //   label: 'Hidden',
  //   type: 'text',
  //   hidden: true,
  //   group: 5,
  // },
  // {
  //   uid: 'hiddenDemoNumber',
  //   label: 'Hidden Number',
  //   type: 'number',
  //   hidden: true,
  //   group: 5,
  // },
  // {
  //   uid: 'toggle',
  //   label: 'Toggle',
  //   type: 'toggle',
  //   group: 5,
  // },
  // {
  //   uid: 'toggleR',
  //   label: 'ToggleR',
  //   type: 'toggle',
  //   readOnly: true,
  //   group: 5,
  // },
  // {
  //   uid: 'expression',
  //   label: 'Expression',
  //   type: 'number',
  //   evaluateType: 'number',
  //   expression: '$count * $multiplier',
  //   expressionReversed: '$count=$_ / $multiplier',
  //   reverseExpression: '$count * $multiplier',
  //   showTotals: true,
  //   group: 5,
  // },
  // {
  //   uid: 'validated',
  //   label: 'Is Validated',
  //   evaluateType: 'string',
  //   type: 'string',
  //   operator: comparisons.equals,
  //   target: 'a',
  //   field: 'select',
  //   invert: true,
  //   group: 5,
  // },
  // {
  //   uid: 'invalid',
  //   label: 'Invalid',
  //   evaluateType: 'number',
  //   type: 'number',
  //   expression: '$nothing',
  //   group: 5,
  // },
  // {
  //   uid: 'invalidb',
  //   label: 'InvalidB',
  //   type: 'number',
  //   evaluateType: 'number',
  //   expression: '$invalid * 2',
  //   group: 5,
  // },
  // {
  //   uid: 'select',
  //   label: 'Select',
  //   type: 'select',
  //   options: [
  //     { uid: 'a', label: 'A' },
  //     { uid: 'b', label: 'B' },
  //     { uid: 'c', label: 'C' },
  //   ],
  //   group: 5,
  // },
  // {
  //   uid: 'internalRoom',
  //   label: 'Internal Room',
  //   type: 'entity',
  //   collection: 'rooms',
  //   group: 5,
  // },
  // {
  //   uid: 'longHeading',
  //   label: 'Long Heading which is really really long',
  //   type: 'entity',
  //   collection: 'rooms',
  //   group: 5,
  // },
  // {
  //   uid: 'customfield',
  //   label: 'Custom',
  //   type: 'custom',
  //   isCustom: true,
  //   showTotals: true,
  //   group: 5,
  // },
  // {
  //   uid: 'customfieldeval',
  //   label: 'Custom Eval',
  //   type: 'customeval',
  //   isCustom: true,
  //   showTotals: true,

  //   expression: '$customfield + 1',
  //   expressionReversed: '$customfield=$_ - 1',
  //   evaluateType: 'number',
  //   group: 5,
  // },
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

// =================================
// import { filterTypes } from '@react_db_client/constants.client-types';

// export const demoHeadingsData = [
//   {
//     uid: 'choice',
//     label: 'Choice',
//     type: EFilterType.select,
//     options: [
//       { uid: 'choicea', label: 'Choice A' },
//       { uid: 'choiceb', label: 'Choice B' },
//     ],
//     required: true,
//     group: 0,
//   },
//   {
//     uid: 'cost',
//     label: 'Cost',
//     type: EFilterType.number,
//     required: true,
//     group: 1,
//   },
//   {
//     uid: 'code',
//     label: 'Code',
//     type: EFilterType.text,
//     required: true,
//     group: 2,
//   },
//   {
//     uid: 'description',
//     label: 'Description',
//     type: EFilterType.textLong,
//     group: 2,
//   },
//   {
//     uid: 'images',
//     label: 'Images',
//     multiple: true,
//     type: EFilterType.image,
//     group: 5,
//   },
//   {
//     uid: 'val',
//     label: 'Value',
//     type: EFilterType.number,
//     group: 5,
//   },
//   {
//     uid: 'documentation',
//     label: 'Documentation',
//     type: EFilterType.file,
//     fileType: 'document',
//     multiple: true,
//     group: 6,
//   },
//   {
//     uid: 'thumbnail',
//     label: 'Thumbnail',
//     type: EFilterType.file,
//     fileType: 'image',
//     group: 7,
//   },
// ];

// export const demoHeadingsDataSimple = demoHeadingsData.slice(0, 4);

// export const demoResults = {
//   demoid: {
//     uid: 'demoid',
//     choice: 'choicea',
//     cost: 10,
//     code: 'Code',
//     description: 'A long description',
//     images: [],
//     val: 9,
//     documentation: 'doc.pdf',
//     thumbnail: 'thumbnail.jpg',
//   },
// };
