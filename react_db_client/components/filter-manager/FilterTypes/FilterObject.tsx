import React from 'react';
import PropTypes from 'prop-types';
import { FilterObjectClass } from '@react_db_client/constants.client-types';
import { IFilterComponentProps } from '../lib';

const FilterObject = ({ filter, updateFilter }: IFilterComponentProps) => {
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
      aria-label={`Filter ${filter.label} object search input`}
    />
  );
};

FilterObject.propTypes = {
  filter: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    operator: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  updateFilter: PropTypes.func.isRequired,
};

export default FilterObject;
