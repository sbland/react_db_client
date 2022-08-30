import React from 'react';
import { switchF } from '@react_db_client/helpers.func-tools';
import { filterTypes, FilterObjectClass } from '@react_db_client/constants.client-types';

import FilterDate from './FilterTypes/FilterDate';
import FilterBool from './FilterTypes/FilterBool';
import FilterSelect from './FilterTypes/FilterSelect';
import FilterString from './FilterTypes/FilterString';
import FilterNumber from './FilterTypes/FilterNumber';
import FilterObject from './FilterTypes/FilterObject';
import { FilterId, IField } from './lib';

export interface IGetFilterComponentsProps {
  filterData: FilterObjectClass[];
  updateFilter: (filterId: FilterId, newFilterData: FilterObjectClass) => {};
  fieldsData: { [key: string]: IField };
  customFiltersComponents: { [key: string]: React.FC };
}

export const useGetFilterComponents = ({
  filterData,
  fieldsData,
  updateFilter,
  customFiltersComponents,
}: IGetFilterComponentsProps) => {
  const mapFilters: false | React.ReactNode[] =
    filterData &&
    Array.isArray(filterData) &&
    filterData.map((filter, i) => {
      // get filter type from the field type
      const { field: fieldId, type } = filter;
      const fieldData = fieldId !== null ? fieldsData[fieldId] : {};
      // TODO: Handle field data is null
      const args = {
        key: filter.uid,
        filter,
        updateFilter: (newFilter) => updateFilter(i, newFilter),
        fieldData,
      };

      const filterTypeComponent: React.ReactNode = switchF(
        type,
        {
          [filterTypes.uid]: () => <FilterString {...args} />,
          [filterTypes.textLong]: () => <FilterString {...args} />,
          [filterTypes.text]: () => <FilterString {...args} />,
          [filterTypes.number]: () => <FilterNumber {...args} />,
          [filterTypes.date]: () => <FilterDate {...args} />,
          [filterTypes.bool]: () => <FilterBool {...args} />,
          [filterTypes.toggle]: () => <FilterBool {...args} />,
          [filterTypes.selectMulti]: () => <FilterSelect {...args} />,
          [filterTypes.select]: () => <FilterSelect {...args} />,
          [filterTypes.embedded]: () => <FilterString {...args} />,
          // TODO:  Image filters may need to be an object search
          [filterTypes.image]: () => <FilterString {...args} />,
          [filterTypes.file]: () => <FilterString {...args} />,
          [filterTypes.fileMultiple]: () => <FilterString {...args} />,
          [filterTypes.reference]: () => <FilterString {...args} />,
          [filterTypes.button]: () => <FilterString {...args} />,
          [filterTypes.selectSearch]: () => <FilterString {...args} />,
          [filterTypes.dict]: () => <FilterObject {...args} />,
          ...Object.entries(customFiltersComponents).reduce((acc, [key, Field]) => {
            acc[key] = () => <Field {...args} />;
            return acc;
          }, {}),
        },
        () => (
          <div key={type || filter.asString()} className="invalidFilter">
            Invalid Filter
            {' - '}
            {filter.uid}
            {' - '}
            {type}
          </div>
        )
      );
      return filterTypeComponent;
    });
  return mapFilters;
};