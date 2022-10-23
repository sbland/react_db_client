import React from 'react';
import PropTypes from 'prop-types';
import { FilterObjectClass } from '@react_db_client/constants.client-types';
import { IFilterComponentProps } from '../lib';

const FilterNumber = ({ filter, updateFilter }: IFilterComponentProps) => {
  const updateValue = (e) => {
    const newFilterData = new FilterObjectClass({
      ...filter,
      value: parseFloat(e.target.value || 0),
    });
    updateFilter(newFilterData);
  };

  return (
    <input
      className="filterInput"
      type="number"
      value={filter.value}
      onChange={updateValue}
      aria-label={`Filter ${filter.label} number input`}
    />
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
