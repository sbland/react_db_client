import React from 'react';
import PropTypes from 'prop-types';
import { MultiSelectDropdown } from '@react_db_client/components.form.form-components.multi-select-dropdown';
import { BubbleSelector } from '@react_db_client/components.form.form-components.bubble-selector';

export const FieldMultiSelect = ({
  uid,
  unit,
  updateFormData,
  value,
  options,
  required,
  asDropdown,
  selectType,
}) => {
  if (asDropdown && selectType === 'dropdown') {
    return (
      <>
        <MultiSelectDropdown
          activeSelection={value || []}
          updateActiveSelection={(newVal) => updateFormData(uid, newVal)}
          options={options}
          required={required}
        />
        {unit && <span>{unit}</span>}
      </>
    );
  }
  if (!asDropdown || selectType === 'hideunselected') {
    return (
      <>
        <BubbleSelector
          activeSelection={value || []}
          updateActiveSelection={(newVal) => updateFormData(uid, newVal)}
          options={options}
          isSorted
        />
        {unit && <span>{unit}</span>}
      </>
    );
  }
  if (selectType === 'showall') {
    return (
      <>
        <BubbleSelector
          activeSelection={value || []}
          updateActiveSelection={(newVal) => updateFormData(uid, newVal)}
          options={options}
        />
        {unit && <span>{unit}</span>}
      </>
    );
  }
  return (
    <>
      Invalid select type
      {selectType}
    </>
  );
};

FieldMultiSelect.propTypes = {
  uid: PropTypes.string.isRequired,
  unit: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.string),
  updateFormData: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  required: PropTypes.bool,
  asDropdown: PropTypes.bool,
  selectType: PropTypes.oneOf(['dropdown', 'showall', 'hideunselected']),
};

FieldMultiSelect.defaultProps = {
  unit: '',
  value: [],
  required: false,
  asDropdown: true,
  selectType: 'dropdown',
};
