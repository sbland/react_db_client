import React from 'react';
import PropTypes from 'prop-types';
import { comparisons, FilterObjectClass } from '@react_db_client/constants.client-types';

const FilterString = ({ filter, updateFilter }) => {
  const updateValue = (e) => {
    const newFilterData = new FilterObjectClass({
      ...filter,
      value: e.target.value || '',
    });
    updateFilter(newFilterData);
  };

  return (
    <input
      type="text"
      className="filterInput"
      value={filter.value}
      onChange={updateValue}
      disabled={filter.operator === comparisons.empty}
    />
  );
};

FilterString.propTypes = {
  filter: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    operator: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  updateFilter: PropTypes.func.isRequired,
};

export default FilterString;
