import React from 'react';

import { FilterPanel } from './filter-manager';
import {
  demoFiltersData,
  demoFieldsData,
  allTypeFilters,
  allTypeFieldsData,
  customFilters,
  customFiltersComponents,
} from './demoData';
import { useManageFilters } from './useManageFilters';

export const FilterManagerWithText = () => {
  const {
    addFilter,
    deleteFilter,
    updateFilter,
    clearFilters,
    updateFieldTarget,
    updateOperator,
    filters,
    fieldsData,
  } = useManageFilters({
    fieldsData: demoFieldsData,
    initialFilterData: demoFiltersData,
    customFilters,
  });

  return (
    <div
      style={{
        height: '400px',
      }}
    >
      <FilterPanel
        filters={filters}
        showPanelOverride
        fieldsData={fieldsData}
        addFilter={addFilter}
        deleteFilter={deleteFilter}
        updateFilter={updateFilter}
        clearFilters={clearFilters}
        updateFieldTarget={updateFieldTarget}
        updateOperator={updateOperator}
        customFilters={customFilters}
        customFiltersComponents={customFiltersComponents}
      />
      {JSON.stringify(filters)}
    </div>
  );
};

export const AllTypes = () => {
  const {
    addFilter,
    deleteFilter,
    updateFilter,
    clearFilters,
    updateFieldTarget,
    updateOperator,
    filters,
    fieldsData,
  } = useManageFilters({
    fieldsData: allTypeFieldsData,
    initialFilterData: allTypeFilters,
  });

  return (
    <div
      style={{
        height: '400px',
      }}
    >
      <FilterPanel
        filters={filters}
        addFilter={addFilter}
        deleteFilter={deleteFilter}
        updateFilter={updateFilter}
        clearFilters={clearFilters}
        showPanelOverride
        fieldsData={fieldsData}
        updateFieldTarget={updateFieldTarget}
        updateOperator={updateOperator}
      />
      {JSON.stringify(filters)}
    </div>
  );
};
