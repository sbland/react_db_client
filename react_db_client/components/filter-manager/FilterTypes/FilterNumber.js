import React from 'react';
import PropTypes from 'prop-types';
import { FilterObjectClass } from '@react_db_client/constants.client-types';

const FilterNumber = ({ filter, updateFilter }) => {
  const updateValue = (e) => {
    const newFilterData = new FilterObjectClass({
      ...filter,
      value: parseFloat(e.target.value || 0),
    });
    updateFilter(newFilterData);
  };

  return (
    <input className="filterInput" type="number" value={filter.value} onChange={updateValue} />
  );
};

FilterNumber.propTypes = {
  filter: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    operator: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  updateFilter: PropTypes.func.isRequired,
};

export default FilterNumber;
