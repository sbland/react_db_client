import React from 'react';

import { FilterPanel } from './filter-manager';
import { demoFiltersData, demoFieldsData, allTypeFilters, allTypeFieldsData } from './demoData';
import { useManageFilters } from './useManageFilters';

export const withText = () => {
  const {
    addFilter,
    deleteFilter,
    updateFilter,
    clearFilters,
    updateFieldTarget,
    updateOperator,
    filters,
  } = useManageFilters({
    fieldsData: demoFieldsData,
    initialFilterData: demoFiltersData,
  });

  return (
    <div
      style={{
        height: '400px',
      }}
    >
      <FilterPanel
        filterData={filters}
        showPanelOverride
        fieldsData={demoFieldsData}
        addFilter={addFilter}
        deleteFilter={deleteFilter}
        updateFilter={updateFilter}
        clearFilters={clearFilters}
        updateFieldTarget={updateFieldTarget}
        updateOperator={updateOperator}
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
        filterData={filters}
        addFilter={addFilter}
        deleteFilter={deleteFilter}
        updateFilter={updateFilter}
        clearFilters={clearFilters}
        showPanelOverride
        fieldsData={allTypeFieldsData}
        updateFieldTarget={updateFieldTarget}
        updateOperator={updateOperator}
      />
      {JSON.stringify(filters)}
    </div>
  );
};
