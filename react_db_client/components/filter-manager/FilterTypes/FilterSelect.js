import React from 'react';
import PropTypes from 'prop-types';
import { FilterObjectClass } from '@react_db_client/constants.client-types';

const FilterSelect = ({ filter, updateFilter, fieldData, multiple }) => {
  const updateValue = (e) => {
    const newFilterData = new FilterObjectClass({
      ...filter,
      value: e.target.value || '',
    });
    updateFilter(newFilterData);
  };

  const { options } = fieldData;
  return (
    <select multiple={multiple} value={filter.value || ''} onChange={updateValue}>
      {!multiple && <option> </option>}
      {options &&
        options.map((opt) => (
          <option key={opt.uid} value={opt.uid}>
            {opt.label}
          </option>
        ))}
    </select>
  );
};

FilterSelect.propTypes = {
  filter: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    operator: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  fieldData: PropTypes.shape({
    options: PropTypes.arrayOf(
      PropTypes.shape({
        uid: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  updateFilter: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
};

FilterSelect.defaultProps = {
  multiple: false,
};

export default FilterSelect;
