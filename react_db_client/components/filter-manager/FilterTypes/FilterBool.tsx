import React from 'react';
import PropTypes from 'prop-types';
import { FilterObjectClass } from '@react_db_client/constants.client-types';
import { ToggleBox } from '@react_db_client/components.form.form-components.toggle-box';

import { IFilterComponentProps } from '../lib';

const FilterBool = ({ filter, updateFilter }: IFilterComponentProps) => {
  const updateValue = (e) => {
    const newFilterData = new FilterObjectClass({
      ...filter,
      value: e,
    });
    updateFilter(newFilterData);
  };

  return (
    <ToggleBox
      id={filter.uid}
      stateIn={filter.value}
      text={filter.value ? 'True' : 'False'}
      onChange={updateValue}
      selectButtonProps={{"aria-label": `Filter ${filter.label} toggle`}}
    />
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
