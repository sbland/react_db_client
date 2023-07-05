import React from 'react';
import {
  EComparisons,
  EFilterType,
  FilterObjectClass,
  FilterOption,
  Uid,
} from '@react_db_client/constants.client-types';
import { TCustomFilter } from '@react_db_client/helpers.filter-helpers';
import { FilterId } from './lib';

/**
 * Update the target field fot a filter row
 * @param {number} index
 * @param {string} fieldId the uid of the new field
 * @param {object} fieldsData data on each field type
 * @param {func} updateFilter function to pass new filter data
 */
export const updateFieldTarget = (index, fieldId, fieldsData, updateFilter, customFilters) => {
  if (!fieldsData[fieldId]) throw Error('Missing Field Data');
  const { uid, field, type } = fieldsData[fieldId];
  const newFilter = new FilterObjectClass({
    ...fieldsData[fieldId],
    field: field || uid,
    filterOptionId: uid,
    type,
    isCustomType: Object.keys(customFilters).indexOf(type) >= 0,
  });
  updateFilter(index, newFilter);
};

export interface IUseManageFiltersArgs {
  fieldsData: { [key: string]: FilterOption };
  initialFilterData?: FilterObjectClass[];
  customFilters?: { [key: string]: TCustomFilter };
  searchFieldTargetField?: Uid;
}

export interface IUseManageFiltersOutput {
  addFilter: (filterData: FilterObjectClass) => void;
  deleteFilter: (filterIndex: FilterId) => void;
  updateFilter: (filterIndex: FilterId, filterData: FilterObjectClass) => void;
  clearFilters: () => void;
  updateFieldTarget: (filterIndex: FilterId, fieldId: string | number) => void;
  updateOperator: (filterId: FilterId, newOperator: EComparisons) => void;
  setSearchStringFilter: (searchString: string) => void;
  filters: FilterObjectClass[];
  fieldsData: { [key: string]: FilterOption };
  setFilters: (filter: FilterObjectClass[]) => void;
}

export const useManageFilters = ({
  fieldsData,
  initialFilterData = [],
  customFilters = {},
  searchFieldTargetField = 'label',
}: IUseManageFiltersArgs): IUseManageFiltersOutput => {
  const [filters, setFilters] = React.useState(initialFilterData);

  const addFilter = React.useCallback((filterData: FilterObjectClass) => {
    setFilters((prev) => {
      return [...prev, filterData];
    });
  }, []);
  const deleteFilter = React.useCallback((filterIndex: FilterId) => {
    setFilters((prev) => {
      const newFilters = prev;
      return newFilters.filter((f, i) => i !== filterIndex);
    });
  }, []);
  const updateFilter = React.useCallback((filterIndex: FilterId, filterData: FilterObjectClass) => {
    setFilters((prev) => {
      const newFilters = [...prev];
      newFilters[filterIndex] = filterData;
      return newFilters;
    });
  }, []);
  const clearFilters = React.useCallback(() => {
    setFilters(() => {
      const newFilters = [];
      return newFilters;
    });
  }, []);

  React.useEffect(() => {
    /* If input filter data changes then reset filters */
    if (initialFilterData) {
      setFilters(initialFilterData);
    } else {
      clearFilters();
    }
  }, [initialFilterData]);

  const updateFieldTarget = React.useCallback(
    (index: FilterId, fieldId: string) => {
      if (!fieldsData[fieldId]) throw Error('Missing Field Data');
      const { uid, type } = fieldsData[fieldId];
      // const isCustomType = !(fieldsData[fieldId].type in filterTypes);

      const newFilter = new FilterObjectClass({
        ...fieldsData[fieldId],
        uid: undefined, // We set as undefined so that it is randomly generated
        field: uid,
        filterOptionId: uid,
        type,
        isCustomType: Object.keys(customFilters).indexOf(type) >= 0,
      });
      updateFilter(index, newFilter);
    },
    [fieldsData, updateFilter, customFilters]
  );

  const updateOperator = (filterId: FilterId, newOperator: EComparisons) => {
    const oldFilter = filters[filterId];
    const newFilterData = new FilterObjectClass({
      ...oldFilter,
      operator: newOperator,
    });
    updateFilter(filterId, newFilterData);
  };

  const setSearchStringFilter = React.useCallback(
    (newSearchString) => {
      setFilters((prev) => {
        // Remove previous search string filter and create a new one
        const filtersCopy = prev ? [...prev.filter((f) => f.uid !== 'search')] : [];
        if (newSearchString && searchFieldTargetField) {
          filtersCopy.push(
            new FilterObjectClass({
              uid: 'search',
              field: searchFieldTargetField,
              value: newSearchString,
              operator: EComparisons.CONTAINS,
              type: EFilterType.text,
            })
          );
          return filtersCopy;
        }
        return filtersCopy;
      });
    },
    [searchFieldTargetField]
  );

  return {
    filters,
    addFilter,
    deleteFilter,
    updateFilter,
    clearFilters,
    updateFieldTarget,
    updateOperator,
    fieldsData,
    setSearchStringFilter,
    setFilters,
  } as IUseManageFiltersOutput;
};
