import React from 'react';
import PropTypes from 'prop-types';
import { SearchAndSelectDropdown } from '@react_db_client/components.search-and-select-dropdown';

export const FieldSelectSearch = ({
  uid,
  unit,
  updateFormData,
  value,
  multiple,
  required,
  searchFn,
  returnFieldOnSelect, // the field in the data to return
  searchFieldTargetField, // the target field that the search string applies to
  labelField, // The field in the returned data to use as the label
  allowEmptySearch,
  className,
}) => {
  // TODO: Handle multiple selection
  if (multiple) throw Error('Multiple not implemented');
  return (
    <>
      <SearchAndSelectDropdown
        searchFunction={searchFn}
        initialValue={value}
        handleSelect={(newVal, data) => updateFormData(uid, data[returnFieldOnSelect])}
        // selectionOverride={value}
        // allowMultiple={multiple}
        // returnFieldOnSelect={returnFieldOnSelect}
        searchFieldTargetField={searchFieldTargetField}
        labelField={labelField}
        className={className}
        allowEmptySearch={allowEmptySearch}
        searchFieldPlaceholder={`${value}`}
        // onChange={(e) => updateFormData(uid, e.target.value)}
        required={required}
      />
      {unit && <span>{unit}</span>}
    </>
  );
};

FieldSelectSearch.propTypes = {
  uid: PropTypes.string.isRequired,
  unit: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  // defaultVal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  updateFormData: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
  searchFn: PropTypes.func.isRequired,
  returnFieldOnSelect: PropTypes.string,
  searchFieldTargetField: PropTypes.string.isRequired,
  labelField: PropTypes.string,
  allowEmptySearch: PropTypes.bool,
  className: PropTypes.string,
};

FieldSelectSearch.defaultProps = {
  unit: '',
  value: null,
  multiple: false,
  // defaultVal: null,
  required: false,
  returnFieldOnSelect: 'uid',
  labelField: 'label',
  allowEmptySearch: false,
  className: '',
};
