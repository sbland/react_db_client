import React from 'react';
import PropTypes from 'prop-types';
import {
  EComparisons,
  FilterObjectClass,
  filterTypesComparisons,
  comparisonMetaData,
} from '@react_db_client/constants.client-types';

import { FilterId, IField } from './lib';
import { useGetFilterComponents } from './useGetFilterComponents';

/**
 * Update the target field fot a filter row
 * @param {number} index
 * @param {string} fieldId the uid of the new field
 * @param {object} fieldsData data on each field type
 * @param {func} updateFilter function to pass new filter data
 */
const updateFieldTarget = (index, fieldId, fieldsData, updateFilter, customFilters) => {
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

export interface IFilterListProps {
  filterData: FilterObjectClass[];
  deleteFilter: (filterId: FilterId) => {};
  updateFilter: (filterId: FilterId, newFilterData: FilterObjectClass) => {};
  fieldsData: { [key: string]: IField };
  customFilters: { [key: string]: () => {} };
  customFiltersComponents: { [key: string]: React.FC };
}

// Map the filters to UI
export const FiltersList = ({
  filterData,
  deleteFilter,
  updateFilter,
  fieldsData,
  customFilters,
  customFiltersComponents,
}: IFilterListProps) => {
  const updateFieldTargetFn = (index, newFieldId) =>
    updateFieldTarget(index, newFieldId, fieldsData, updateFilter, customFilters);

  // for each filter create a row
  const filterElements = useGetFilterComponents({
    filterData,
    fieldsData,
    updateFilter,
    customFiltersComponents,
  });

  const mapFilters =
    filterData &&
    Array.isArray(filterData) &&
    filterData.map((filter, i) => {
      const filterTypeComponent = filterElements[i];
      const { field: fieldId, type } = filter;
      const { validComparisons = null } = fieldId !== null ? fieldsData[fieldId] : {};
      const comparisonOptions: EComparisons[] =
        validComparisons != null ? validComparisons : filterTypesComparisons[type];
      // TODO: Handle field data is null
      const updateOperator = (e) => {
        const newFilterData = new FilterObjectClass({
          ...filter,
          operator: e.target.value,
        });
        updateFilter(i, newFilterData);
      };

      return (
        <li className="filterPanel_filterItem" key={filter.uid} id={filter.uid}>
          {/* Delete filter button */}
          <button
            type="button"
            className="button-one deleteFilterBtn"
            onClick={() => deleteFilter(i)}
          >
            X
          </button>
          {/* Target field select */}
          <select
            value={filter.filterOptionId || ''}
            onChange={(e) => updateFieldTargetFn(i, e.target.value)}
            className="filterItem_filterFieldSelect"
          >
            {Object.values(fieldsData)
              .filter((f) => !f.noFilter)
              .map((opt) => (
                <option value={opt.uid} key={opt.uid}>
                  {opt.label}
                </option>
              ))}
          </select>
          <select
            value={filter.operator}
            onChange={updateOperator}
            className="filterOperatorSelect"
          >
            {comparisonOptions.map((c) => (
              <option key={c} value={c}>
                {comparisonMetaData[c]?.label || 'MISSING COMPARISON LABEL!'}
              </option>
            ))}
          </select>
          {/* Filter input */}
          {filterTypeComponent}
        </li>
      );
    });
  return (
    <ul className="filterPanel_filterList">
      {mapFilters || 'Invalid Filter Data'}
      {filterData && filterData.length === 0 && 'No filters'}
    </ul>
  );
};

FiltersList.propTypes = {
  filterData: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
      operator: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  deleteFilter: PropTypes.func.isRequired,
  updateFilter: PropTypes.func.isRequired,
  fieldsData: PropTypes.objectOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      field: PropTypes.string, // default is uid
    })
  ).isRequired,
  customFilters: PropTypes.objectOf(PropTypes.func),
  customFiltersComponents: PropTypes.objectOf(PropTypes.elementType),
};

FiltersList.defaultProps = {
  customFilters: {},
  customFiltersComponents: {},
};
