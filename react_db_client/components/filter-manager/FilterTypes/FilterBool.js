import React from 'react';
import PropTypes from 'prop-types';
import { comparisons, FilterObjectClass } from '@react_db_client/constants.client-types';

import { ToggleBox } from '@samnbuk/react_db_client.components.form.form-components.toggle-box';

const FilterBool = ({ filter, updateFilter }) => {
  const updateOperator = (e) => {
    const newFilterData = new FilterObjectClass({
      ...filter,
      operator: e.target.value,
    });
    updateFilter(newFilterData);
  };

  const updateValue = (e) => {
    const newFilterData = new FilterObjectClass({
      ...filter,
      value: e,
    });
    updateFilter(newFilterData);
  };

  return (
    <>
      <select value={filter.operator} onChange={updateOperator} className="filterOperatorSelect">
        {/* eslint-disable-next-line react/jsx-boolean-value */}
        <option value={comparisons.equals}>Is</option>
      </select>
      <ToggleBox
        id={filter.uid}
        stateIn={filter.value}
        text={filter.value ? 'True' : 'False'}
        onChange={updateValue}
      />
    </>
  );
};

FilterBool.propTypes = {
  filter: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    operator: PropTypes.string,
    value: PropTypes.bool,
  }).isRequired,
  updateFilter: PropTypes.func.isRequired,
};

export default FilterBool;
