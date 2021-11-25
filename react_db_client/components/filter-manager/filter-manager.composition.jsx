import React, { useState } from 'react';

import { FilterObjectClass, filterTypes } from '@samnbuk/react_db_client.constants.client-types';

import { FilterPanel } from './filter-manager';
import { demoFiltersData, demoFieldsData } from './demoData';

export const withText = () => {
  const [filters, setFilters] = useState(demoFiltersData);

  const addFilter = (filterData) => {
    setFilters((prev) => {
      console.log(filterData);
      return prev.concat(filterData);
    });
  };
  const deleteFilter = (filterId) => {
    setFilters((prev) => {
      console.log(filterId);
      const newFilters = prev;
      return newFilters.filter((f, i) => i !== filterId);
    });
  };
  const updateFilter = (filterId) => {
    setFilters((prev) => {
      const newFilters = prev;
      return newFilters;
    });
  };
  const clearFilters = () => {
    setFilters(() => {
      const newFilters = [];
      return newFilters;
    });
  };

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
      />
      {JSON.stringify(filters)}
    </div>
  );
};

export const AllTypes = () => {
  const fieldsData = {};
  Object.keys(filterTypes).forEach((key) => {
    fieldsData[key] = {
      uid: key,
      label: key,
      type: key,
    };
  });
  const [filters, setFilters] = useState(
    Object.keys(filterTypes).map(
      (key) =>
        new FilterObjectClass({
          uid: key,
          field: key,
          value: 0,
          expression: '',
          type: key,
        })
    )
  );

  return (
    <div
      style={{
        height: '400px',
      }}
    >
      <FilterPanel
        filterData={filters}
        setFilterData={setFilters}
        showPanelOverride
        fieldsData={fieldsData}
      />
      {JSON.stringify(filters)}
    </div>
  );
};
