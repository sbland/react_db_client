import React from 'react';
import PropTypes from 'prop-types';
import { FilterObjectClass } from '@react_db_client/constants.client-types';
import { IFilterComponentProps } from '../lib';

const FilterDate = ({ filter, updateFilter }: IFilterComponentProps) => {
  const updateValue = (e) => {
    const newFilterData = new FilterObjectClass({
      ...filter,
      value: new Date(e.target.value).toISOString().substr(0, 10),
    });
    updateFilter(newFilterData);
  };

  const parsedDate =
    filter.value instanceof Date
      ? filter.value.toISOString().substr(0, 10)
      : new Date(filter.value || 0).toISOString().substr(0, 10);

  return (
    <input
      className="filterInput"
      type="date"
      value={filter.value ? parsedDate : ''}
      onChange={updateValue}
      aria-label={`Filter ${filter.label} date input`}
    />
  );
};

FilterDate.propTypes = {
  filter: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    operator: PropTypes.string,
    value: PropTypes.instanceOf(Date),
  }).isRequired,
  updateFilter: PropTypes.func.isRequired,
};

export default FilterDate;
