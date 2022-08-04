import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { SearchAndSelectDropdown } from '@react_db_client/components.search-and-select-dropdown';

export const ShowMultiSelection = ({ values, labelField, onSelect }) => {
  return (
    <div>
      {values?.map((v) => (
        <button onClick={() => onSelect(v)} key={v.uid || v}>
          {v[labelField] || v.uid || v}
        </button>
      ))}
    </div>
  );
};

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
  const valueIn = useMemo(() => (multiple ? '' : value), [multiple, value]);

  const handleSelect = useCallback(
    (_, data) => {
      let newVal = returnFieldOnSelect ? data[returnFieldOnSelect] : data;
      if (multiple) {
        if (Array.isArray(value)) {
          const newValueArray = value.concat(data);
          newVal = newValueArray;
        } else {
          newVal = [data];
        }
      }
      updateFormData(uid, newVal);
    },
    [multiple, updateFormData, returnFieldOnSelect]
  );

  const clickSelectedItem = useCallback((selectedItem) => {
    if (Array.isArray(value)) {
      const newValueArray = value.filter((v) => (v.uid != null || v.uid !== selectedItem.uid) && v !== selectedItem);
      updateFormData(uid, newValueArray);
    } else {
      updateFormData(uid, []);
    }
  }, []);

  return (
    <>
      <SearchAndSelectDropdown
        searchFunction={searchFn}
        initialValue={valueIn}
        handleSelect={handleSelect}
        searchFieldTargetField={searchFieldTargetField}
        labelField={labelField}
        className={className}
        allowEmptySearch={allowEmptySearch}
        searchFieldPlaceholder={`${value || 'search...'}`}
        required={required}
      />
      {multiple && (
        <ShowMultiSelection onSelect={clickSelectedItem} labelField={labelField} values={value} />
      )}
    </>
  );
};

FieldSelectSearch.propTypes = {
  uid: PropTypes.string.isRequired,
  unit: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.shape({ uid: PropTypes.string }),
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.shape({ uid: PropTypes.string }),
      ])
    ),
  ]),
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
