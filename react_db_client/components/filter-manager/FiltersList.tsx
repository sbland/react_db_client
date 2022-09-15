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

export interface IFilterListProps {
  filterData: FilterObjectClass[];
  deleteFilter: (filterId: FilterId) => void;
  updateFilter: (filterId: FilterId, newFilterData: FilterObjectClass) => void;
  fieldsData: { [key: string]: IField };
  customFiltersComponents: { [key: string]: React.FC };
  updateFieldTarget: (filterId: FilterId, fieldId: string | number) => void;
  updateOperator: (filterId: FilterId, newOperator: EComparisons) => void;
}

// Map the filters to UI
export const FiltersList = ({
  filterData,
  deleteFilter,
  updateFilter,
  fieldsData,
  customFiltersComponents,
  updateFieldTarget,
  updateOperator,
}: IFilterListProps) => {
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
            onChange={(e) => updateFieldTarget(i, e.target.value)}
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
            onChange={(e) => updateOperator(i, e.target.value as EComparisons)}
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
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
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
