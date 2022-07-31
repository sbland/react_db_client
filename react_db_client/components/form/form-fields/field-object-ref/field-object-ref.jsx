import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import { SearchAndSelectDropdown } from '@react_db_client/components.search-and-select-dropdown';


const parseVal = (val) => {
  if (!val) {
    return [];
  }
  return Array.isArray(val) ? val : [val];
};

const getSearchFieldPlaceholder = (val, field) => {
  return val[0] ? val[0][field] : 'Search...';
};

const SelectedItems = ({ items, labelField, handleItemClick }) => {
  return (
    <div className="">
      {items.map((item) => (
        <button
          type="button"
          className="button-one"
          onClick={() => handleItemClick(item.uid, item)}
        >
          {item[labelField]}
        </button>
      ))}
    </div>
  );
};

const searchFn = (asyncGetDocuments, collection, schema, sortBy) => async (filters) => {
  return asyncGetDocuments(collection, filters || [], schema, sortBy);
};

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
  asyncGetDocuments,
}) => {
  let valueChecked = useMemo(() => parseVal(value), [value]);
  let searchFieldPlaceholder = multiple
    ? 'Choose from dropdown...'
    : getSearchFieldPlaceholder(valueChecked, labelField);

  const handleSelect = useCallback(
    // eslint-disable-next-line no-unused-vars
    (selectedId, data) => {
      const newData = multiple
        ? [...valueChecked, data].filter(
            (v, i, self) => self.findIndex((vv) => vv.uid == v.uid) == i
          )
        : data;
      updateFormData(uid, newData);
      // if (newVal !== value) updateFormData(uid, newVal);
    },
    [updateFormData, uid, multiple, valueChecked]
  );

  const handleSelectedClick = useCallback(
    (itemUid) => {
      const newData = valueChecked.filter((v) => v.uid !== itemUid);
      updateFormData(uid, newData);
    },
    [updateFormData, uid, valueChecked]
  );

  return (
    <>
      <SearchAndSelectDropdown
        searchFunction={searchFn(asyncGetDocuments, collection, '_id', labelField)}
        handleSelect={handleSelect}
        initialValue={valueChecked}
        allowMultiple={multiple}
        searchFieldTargetField={labelField}
        labelField={labelField}
        className="formFieldInput"
        searchFieldPlaceholder={searchFieldPlaceholder}
        // onChange={(e) => updateFormData(uid, e.target.value)}
        required={required}
        allowEmptySearch={allowEmptySearch}
      />
      {/* TODO: Add selected items here if using multiple */}
      {multiple && (
        <SelectedItems
          items={valueChecked}
          labelField={labelField}
          handleItemClick={handleSelectedClick}
        />
      )}
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
  /* Async func to get documents for selection
   * Signature: (collection<string>, filters<Array>, schema<String>, sortBy<String>) => <Array>
   */
  asyncGetDocuments: PropTypes.func.isRequired,
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
