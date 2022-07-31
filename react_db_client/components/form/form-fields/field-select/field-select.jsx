import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { SearchAndSelectDropdown } from '@react_db_client/components.search-and-select-dropdown';
import {
  ToggleBox,
  ToggleBoxRadioGroup,
} from '@react_db_client/components.form.form-components.toggle-box';

export const FieldSelect = ({
  uid,
  unit,
  updateFormData,
  value,
  options,
  multiple,
  required,
  labelField,
  selectType,
  defaultVal,
}) => {
  const selection =
    (value && options && options.find((o) => o.uid === value)) ||
    (defaultVal && options.find((o) => o.uid === defaultVal));
  const searchFunction = useCallback(async () => options, [options]);
  switch (selectType) {
    case 'dropdown':
      return (
        <>
          <SearchAndSelectDropdown
            searchFunction={searchFunction}
            handleSelect={(newVal) => updateFormData(uid, newVal)}
            initialValue={selection}
            allowMultiple={multiple}
            searchFieldTargetField={labelField}
            labelField={labelField}
            className="formFieldInput"
            searchFieldPlaceholder={selection ? selection[labelField] : 'search...'}
            onChange={(e) => updateFormData(uid, e.target.value)}
            required={required}
            searchDelay={0}
            allowEmptySearch
          />
          {unit && <span>{unit}</span>}
        </>
      );
    case 'toggle':
      return (
        <ToggleBoxRadioGroup
          selected={options.findIndex((opt) => opt.uid === value)}
          allowDeselect
          onChange={(i, v) => updateFormData(uid, v)}
          className="flexHoriz"
        >
          {options.map((opt) => (
            <ToggleBox text={opt.label} id={opt.uid} key={opt.uid} onChange={() => {}} />
          ))}
        </ToggleBoxRadioGroup>
      );
    default:
      return <div>INVALID SELECT TYPE {selectType} </div>;
  }
};

FieldSelect.propTypes = {
  uid: PropTypes.string.isRequired,
  unit: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  updateFormData: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
  labelField: PropTypes.string,
  selectType: PropTypes.oneOf(['dropdown', 'toggle']),
  defaultVal: PropTypes.any,
};

FieldSelect.defaultProps = {
  unit: '',
  value: null,
  multiple: false,
  // defaultVal: null,
  required: false,
  labelField: 'label',
  selectType: 'dropdown',
  defaultVal: null,
};
