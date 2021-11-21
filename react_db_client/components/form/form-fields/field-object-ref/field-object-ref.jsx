import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { SearchAndSelectDropdown } from '@samnbuk/react_db_client.components.search-and-select';

// const searchFn = (collection, schema, sortBy) => async (filters) => {
//   return apiGetDocuments(collection, filters || [], schema, sortBy);
// };

/**
 * A form field that deals with object id references
 */
export const FieldObjectRef = ({
  uid,
  unit,
  updateFormData,
  value,
  multiple,
  collection,
  required,
  labelField, // The field in the returned data to use as the label
  allowEmptySearch,
  searchFn,
}) => {
  const handleSelect = useCallback(
    // eslint-disable-next-line no-unused-vars
    (newVal, data) => {
      if (newVal !== value) updateFormData(uid, newVal);
    },
    [updateFormData, uid, value]
  );
  let searchFieldPlaceholder = 'Search...';
  let selectionOverride = null;
  if (multiple) {
    searchFieldPlaceholder = 'Choose from dropdown...';
    selectionOverride = Array.isArray(value) ? value : [value].filter((a) => a !== null);
  } else {
    searchFieldPlaceholder = value ? value[labelField] : searchFieldPlaceholder;
    selectionOverride = value ? [value] : [];
  }
  return (
    <>
      <SearchAndSelectDropdown
        searchFunction={searchFn(collection, '_id')}
        handleSelect={handleSelect}
        selectionOverride={selectionOverride}
        allowMultiple={multiple}
        returnFieldOnSelect="_id"
        searchFieldTargetField={labelField}
        labelField={labelField}
        // TODO: pass classname to sas
        className="formFieldInput"
        searchFieldPlaceholder={searchFieldPlaceholder}
        // onChange={(e) => updateFormData(uid, e.target.value)}
        required={required}
        allowEmptySearch={allowEmptySearch}
      />
      {unit && <span>{unit}</span>}
    </>
  );
};

const objRefShape = {
  _id: PropTypes.string.isRequired,
  uid: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string,
};

FieldObjectRef.propTypes = {
  uid: PropTypes.string.isRequired,
  unit: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.shape(objRefShape),
    PropTypes.arrayOf(PropTypes.shape(objRefShape)),
  ]),
  updateFormData: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
  labelField: PropTypes.string,
  collection: PropTypes.string.isRequired,
  allowEmptySearch: PropTypes.bool,
  searchFn: PropTypes.func.isRequired,
};

FieldObjectRef.defaultProps = {
  unit: '',
  value: null,
  multiple: false,
  // defaultVal: null,
  required: false,
  labelField: 'label',
  allowEmptySearch: false,
};
