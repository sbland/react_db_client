import { EFilterType, FilterOption } from '@react_db_client/constants.client-types';
import { comparisons, FilterObjectClass } from '@react_db_client/constants.client-types';

export const demoFilterString = new FilterObjectClass({
  uid: 'demoFilterString',
  field: 'name',
  value: 'Foo',
  operator: comparisons.contains,
  type: EFilterType.text,
});
export const demoFilterNumber = new FilterObjectClass({
  uid: 'demoFilterNumber',
  field: 'count',
  value: 0,
  operator: comparisons.greaterThan,
  type: EFilterType.number,
});
// export const demoFilterExpression = new FilterObjectClass({
//   uid: 'demoFilterExpression',
//   field: 'expression',
//   value: 0,
//   operator: '>',
// });

export const demoFilterSelect = new FilterObjectClass({
  uid: 'demoFilterExpression',
  field: 'select',
  value: 'a',
  operator: comparisons.contains,
  type: EFilterType.select,
});

export const demoFieldsData: { [k: string]: FilterOption<any, boolean> } = {
  name: new FilterOption({
    uid: 'name',
    field: 'name',
    value: null,
    label: 'Name',
    type: EFilterType.text,
  }),
  count: new FilterOption({
    uid: 'count',
    field: 'count',
    value: null,
    label: 'Count',
    type: EFilterType.number,
  }),
  filterA: new FilterOption({
    uid: 'filterA',
    field: 'filterA',
    value: null,
    label: 'filter A',
    type: EFilterType.text,
  }),
  filterB: new FilterOption({
    uid: 'filterB',
    field: 'filterB',
    value: null,
    label: 'filter B',
    type: EFilterType.text,
  }),
  select: new FilterOption({
    uid: 'select',
    field: 'select',
    value: null,
    label: 'Select',
    type: EFilterType.select,
    options: [
      { uid: 'a', label: 'A' },
      { uid: 'b', label: 'B' },
    ],
  }),
  // Embedded filters currently disabled
  // filterEmbedded: nr{
  //   uid: 'filterEmbedded',
  //   label: 'Embedded Filter',
  //   type: EFilterType.embedded,
  //   filters: {
  //     filterC: {
  //       uid: 'filterC',
  //       label: 'filter C',
  //       type: EFilterType.text,
  //     },
  //     filterD: {
  //       uid: 'filterD',
  //       label: 'filter D',
  //       type: EFilterType.text,
  //     },
  //   },
  // },
};

export const demoFiltersData = [
  demoFilterString,
  demoFilterNumber,
  // demoFilterExpression,
  demoFilterSelect,
];
