import React from 'react';
import {
  comparisons,
  FilterObjectClass,
  EFilterType,
  EComparisons,
  FilterOption,
} from '@react_db_client/constants.client-types';

export const demoFieldName = new FilterOption<any, false>({
  uid: 'name',
  field: 'name',
  label: 'Name',
  type: EFilterType.text,
});

export const demoFieldCount = new FilterOption<any, false>({
  uid: 'count',
  field: 'count',
  label: 'Count',
  type: EFilterType.number,
});

export const demoFieldSelect = new FilterOption<any, false>({
  uid: 'select',
  field: 'select',
  label: 'Select',
  type: EFilterType.select,
  options: [
    { uid: 'a', label: 'A' },
    { uid: 'b', label: 'B' },
  ],
});

export const customField = new FilterOption<any, true>({
  uid: 'customField',
  field: 'customField',
  type: 'customFieldType',
  label: 'Custom field',
  operators: [EComparisons.EQUALS],
  isCustomType: true,
});

export const demoFieldsData: { [k: string]: FilterOption<any, boolean> } = {
  name: demoFieldName,
  count: demoFieldCount,
  filterA: new FilterOption({
    uid: 'filterA',
    field: 'filterA',
    label: 'filter A',
    type: EFilterType.text,
  }),
  filterB: new FilterOption({
    uid: 'filterB',
    field: 'filterB',
    label: 'filter B',
    type: EFilterType.text,
  }),
  select: demoFieldSelect,
  // TODO: Check if we need to support nested types
  // filterEmbedded: {
  //   uid: 'filterEmbedded',
  //   label: 'Embedded Filter',
  //   type: EFilterType.embedded,
  //   filters: {
  //     filterC: new FilterOption<any, false>({
  //       uid: 'filterC',
  //       field: 'filterC',
  //       label: 'filter C',
  //       type: EFilterType.text,
  //     }),
  //     filterD: new FilterOption<any, false>({
  //       uid: 'filterD',
  //       field: 'filterD',
  //       label: 'filter D',
  //       type: EFilterType.text,
  //     }),
  //   },
  // },
  customField,
};
export const exampleOptions = [
  { uid: 'foo', label: 'Foo' },
  { uid: 'bar', label: 'Bar' },
];

const selectionTypes = [EFilterType.select, EFilterType.selectMulti];

export const allTypeFieldsData = Object.keys(EFilterType)
  .map(
    (key) =>
      ({
        uid: key,
        label: key,
        field: key,
        type: key,
        typeArgs: {
          options: selectionTypes.indexOf(key as EFilterType) !== -1 ? exampleOptions : undefined,
        },
      } as FilterOption<any, false>)
  )
  .reduce((acc, v) => ({ ...acc, [v.uid]: v }), {}) as Record<
  EFilterType,
  FilterOption<any, false>
>;

export const allTypeFilters: FilterObjectClass[] = Object.values(allTypeFieldsData).map(
  (field: FilterOption) =>
    new FilterObjectClass({
      ...field,
      field: field.uid,
      value: undefined,
      // expression: null,
      type: field.type,
    })
);

export const demoFilterString = new FilterObjectClass({
  uid: 'demoFilterString',
  field: demoFieldName.uid,
  label: 'Example String Field',
  value: 'Foo',
  operator: comparisons.contains,
  type: EFilterType.text,
});
export const demoFilterNumber = new FilterObjectClass({
  uid: 'demoFilterNumber',
  field: 'count',
  label: 'Example Number Field',
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
  field: demoFieldSelect.uid,
  value: 'a',
  operator: comparisons.contains,
  type: EFilterType.select,
});

export const demoFilterCustom = new FilterObjectClass({
  uid: 'demoFilterCustom',
  field: customField.uid,
  value: 'a',
  operator: comparisons.contains,
  type: 'customFilter',
  isCustomType: true,
});

export const demoFiltersData: FilterObjectClass[] = [
  demoFilterString,
  demoFilterNumber,
  // demoFilterExpression,
  demoFilterSelect,
  demoFilterCustom,
];

export const customFilter = () => false;
export const CustomFilterComponent = ({ filter, updateFilter }) => (
  <div data-testid="customFilter">
    <span>Custom Filter Component</span>

    <button
      onClick={() => {
        const newFilterData = new FilterObjectClass({
          ...filter,
          value: 'button clicked',
        });
        updateFilter(newFilterData);
      }}
    >
      Click me
    </button>
  </div>
);
export const customFilters = { customFilter, customFieldType: customFilter };
export const customFiltersComponents = {
  customFilter: CustomFilterComponent,
  customFieldType: CustomFilterComponent,
};
