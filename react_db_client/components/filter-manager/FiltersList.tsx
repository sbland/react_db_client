import React from 'react';
import PropTypes from 'prop-types';
import {
  EComparisons,
  FilterObjectClass,
  filterTypesComparisons,
  comparisonMetaData,
  FilterOption,
} from '@react_db_client/constants.client-types';

import { FilterId, IFilterComponentProps } from './lib';
import { useGetFilterComponents } from './useGetFilterComponents';
import {
  FilterListColumnBtns,
  FilterListColumnField,
  FilterListColumnOperator,
  FilterListColumnValue,
  FilterListHeadingsStyle,
  FilterListItemStyle,
  FilterListStyle,
} from './styles';

export interface IFilterListProps {
  filterData: FilterObjectClass[];
  deleteFilter: (filterId: FilterId) => void;
  updateFilter: (filterId: FilterId, newFilterData: FilterObjectClass) => void;
  fieldsData: { [key: string]: FilterOption };
  customFiltersComponents: { [key: string]: React.FC<IFilterComponentProps<any, true>> };
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
  if (!Array.isArray(filterData)) throw Error('filterData must be array!');

  const mappedFilters =
    filterData &&
    Array.isArray(filterData) &&
    filterData.map((filter, i) => {
      const filterTypeComponent = filterElements[i] || <>MISSING COMPONENT FOR {filter.field}</>;
      const { field: fieldId, type } = filter;
      const { operators = null } = fieldId != null ? fieldsData[fieldId] || {} : {};
      const comparisonOptions: EComparisons[] =
        operators != null ? operators : filterTypesComparisons[type];
      if (!comparisonOptions)
        throw Error(`comparisonOptions not found for field: "${fieldId}" type: "${type}"`);

      return (
        <FilterListItemStyle
          className="filterPanel_filterItem"
          key={filter.uid}
          id={`${filter.uid}`}
        >
          {/* Delete filter button */}
          <FilterListColumnBtns>
            <button
              type="button"
              className="button-one deleteFilterBtn"
              onClick={() => deleteFilter(i)}
              aria-label={`Delete ${filter.label} button`}
            >
              X
            </button>
          </FilterListColumnBtns>
          {/* Target field select */}
          <FilterListColumnField>
            <select
              value={filter.field || ''}
              // value={filter.filterOptionId || ''}
              onChange={(e) => updateFieldTarget(i, e.target.value)}
              className="filterItem_filterFieldSelect"
              aria-label={`Select ${filter.label} field`}
            >
              {Object.values(fieldsData)
                // .filter((f) => !f.noFilter)
                .map((opt) => (
                  <option value={opt.uid} key={opt.uid}>
                    {opt.label}
                  </option>
                ))}
            </select>
          </FilterListColumnField>
          <FilterListColumnOperator>
            <select
              value={filter.operator}
              onChange={(e) => updateOperator(i, e.target.value as EComparisons)}
              className="filterOperatorSelect"
              aria-label={`Select ${filter.label} operator`}
            >
              {comparisonOptions.map((c) => (
                <option key={c} value={c}>
                  {comparisonMetaData[c]?.label || 'MISSING COMPARISON LABEL!'}
                </option>
              ))}
            </select>
          </FilterListColumnOperator>
          <FilterListColumnValue>
            {/* Filter input */}
            {filterTypeComponent}
          </FilterListColumnValue>
        </FilterListItemStyle>
      );
    });

  return (
    <div>
      <FilterListHeadingsStyle>
        <FilterListColumnBtns />
        <FilterListColumnField>
          <label>Field</label>
        </FilterListColumnField>
        <FilterListColumnOperator>
          <label>Operator</label>
        </FilterListColumnOperator>
        <FilterListColumnValue>
          <label>Value</label>
        </FilterListColumnValue>
      </FilterListHeadingsStyle>
      <FilterListStyle className="filterPanel_filterList">
        {mappedFilters || 'Invalid Filter Data'}
        {filterData && filterData.length === 0 && 'No filters'}
      </FilterListStyle>
    </div>
  );
};

FiltersList.propTypes = {
  filterData: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
      operator: PropTypes.string,
      value: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
        PropTypes.number,
        PropTypes.instanceOf(Date),
      ]),
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
