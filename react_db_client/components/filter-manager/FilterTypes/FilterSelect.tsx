import React from 'react';
import PropTypes from 'prop-types';
import { FilterObjectClass } from '@react_db_client/constants.client-types';
import { IFilterComponentProps } from '../lib';

const FilterSelect = ({ filter, updateFilter, fieldData }: IFilterComponentProps) => {
  const updateValue = (e) => {
    const newFilterData = new FilterObjectClass({
      ...filter,
      value: e.target.value || '',
    });
    updateFilter(newFilterData);
  };

  if(!fieldData.typeArgs) throw Error(`Select filter "${filter.uid}" is missing typeArgs`)

  const { options, multiple } = fieldData.typeArgs;

  return (
    <select
      multiple={multiple}
      value={filter.value || ''}
      onChange={updateValue}
      aria-label={`Filter ${filter.label} select`}
    >
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
    typeArgs: PropTypes.shape({
      multiple: PropTypes.bool,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          uid: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
    }),
  }).isRequired,
  updateFilter: PropTypes.func.isRequired,
};

export default FilterSelect;
