import React from 'react';
import { switchF } from '@react_db_client/helpers.func-tools';
import { EFilterType, FilterOption } from '@react_db_client/constants.client-types';

import FilterDate from './FilterTypes/FilterDate';
import FilterBool from './FilterTypes/FilterBool';
import FilterSelect from './FilterTypes/FilterSelect';
import FilterString from './FilterTypes/FilterString';
import FilterNumber from './FilterTypes/FilterNumber';
import FilterObject from './FilterTypes/FilterObject';
import { IFilterComponentProps, IGetFilterComponentProps, IGetFilterComponentsProps } from './lib';

export const InvalidFilter = ({ type, filter }) => (
  <div key={type || filter.asString()} className="invalidFilter">
    Invalid Filter
    {' - '}
    {filter.uid}
    {' - '}
    {type}
  </div>
);

export const getFilterComponent = <VType, IsCustomType extends true | false = false>({
  filter,
  fieldData,
  updateFilter,
  customFiltersComponents,
}: IGetFilterComponentProps<VType, IsCustomType>) => {
  const { type } = filter;

  const argsCommon = {
    key: `${filter.uid}`,
    filter,
    updateFilter: (newFilter) => updateFilter(newFilter),
    fieldData,
  };

  const filterTypeComponent: React.ReactNode = switchF<string, React.ReactNode>(
    type,
    {
      [EFilterType.uid]: () => (
        <FilterString {...(argsCommon as IFilterComponentProps<any, false>)} />
      ),
      [EFilterType.textLong]: () => (
        <FilterString {...(argsCommon as IFilterComponentProps<any, false>)} />
      ),
      [EFilterType.text]: () => (
        <FilterString {...(argsCommon as IFilterComponentProps<any, false>)} />
      ),
      [EFilterType.number]: () => (
        <FilterNumber {...(argsCommon as IFilterComponentProps<any, false>)} />
      ),
      [EFilterType.date]: () => (
        <FilterDate {...(argsCommon as IFilterComponentProps<any, false>)} />
      ),
      [EFilterType.bool]: () => (
        <FilterBool {...(argsCommon as IFilterComponentProps<any, false>)} />
      ),
      [EFilterType.toggle]: () => (
        <FilterBool {...(argsCommon as IFilterComponentProps<any, false>)} />
      ),
      [EFilterType.selectMulti]: () => (
        <FilterSelect {...(argsCommon as IFilterComponentProps<any, false>)} />
      ),
      [EFilterType.select]: () => (
        <FilterSelect {...(argsCommon as IFilterComponentProps<any, false>)} />
      ),
      [EFilterType.embedded]: () => (
        <FilterString {...(argsCommon as IFilterComponentProps<any, false>)} />
      ),
      // TODO:  Image filters may need to be an object search
      [EFilterType.image]: () => (
        <FilterString {...(argsCommon as IFilterComponentProps<any, false>)} />
      ),
      [EFilterType.file]: () => (
        <FilterString {...(argsCommon as IFilterComponentProps<any, false>)} />
      ),
      [EFilterType.fileMultiple]: () => (
        <FilterString {...(argsCommon as IFilterComponentProps<any, false>)} />
      ),
      [EFilterType.reference]: () => (
        <FilterString {...(argsCommon as IFilterComponentProps<any, false>)} />
      ),
      [EFilterType.button]: () => (
        <FilterString {...(argsCommon as IFilterComponentProps<any, false>)} />
      ),
      [EFilterType.selectSearch]: () => (
        <FilterString {...(argsCommon as IFilterComponentProps<any, false>)} />
      ),
      [EFilterType.dict]: () => (
        <FilterObject {...(argsCommon as IFilterComponentProps<any, false>)} />
      ),
      ...Object.entries(customFiltersComponents).reduce((acc, [key, Field]) => {
        acc[key] = () => <Field {...(argsCommon as IFilterComponentProps<any, true>)} />;
        return acc;
      }, {}),
    },
    () => <InvalidFilter type={type} filter={filter} />
  );
  return filterTypeComponent;
};

export const INVALID_FIELD = new FilterOption<never, true>({
  uid: 'MISSING_FIELD',
  label: 'MISSING FIELD',
  field: 'MISSING FIELD',
  type: 'INVALID',
  isCustomType: true,
  operators: [],
});

export const useGetFilterComponents = ({
  filterData,
  fieldsData,
  updateFilter,
  customFiltersComponents,
}: IGetFilterComponentsProps) => {
  const filterComponents: React.ReactNode[] =
    filterData && Array.isArray(filterData)
      ? filterData.map((filter, i) =>
          getFilterComponent<any, boolean>({
            filter,
            fieldData: filter.field ? fieldsData[filter.field] : INVALID_FIELD,
            customFiltersComponents,
            updateFilter: (filterData) => updateFilter(i, filterData),
          })
        )
      : [];
  return filterComponents;
};
