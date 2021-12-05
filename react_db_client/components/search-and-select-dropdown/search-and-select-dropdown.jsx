import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  FilterObjectClass,
  filterTypes,
  comparisons,
} from '@samnbuk/react_db_client.constants.client-types';
import { useAsyncRequest } from '@samnbuk/react_db_client.async-hooks.use-async-request';
import { CustomSelectDropdown } from '@samnbuk/react_db_client.components.custom-select-dropdown';

import { LoadingIcon } from './loading-icon';

import './style.scss';

/**
 * Search and Select Dropdown Component
 * Dropdown selection with async data load

 */
export const SearchAndSelectDropdown = ({
  searchFunction,
  handleSelect,
  intitialValue,
  searchFieldTargetField, // the target field that the search string applies to
  labelField, // The field in the returned data to use as the label
  className,
  searchFieldPlaceholder,
  allowEmptySearch,
  searchDelay,
  valid,
}) => {
  // TODO: Provide default search function
  const [searchValue, setSearchValue] = useState(() => intitialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const firstItemRef = useRef(null);
  const searchFieldRef = useRef(null);
  const searchTimeout = useRef(null);

  const goBackToSearchField = () => searchFieldRef.current.select();
  const [results, setResults] = useState([]);

  const searchCallback = useCallback((resultsNew) => {
    setResults(resultsNew);
    setLoading(false);
  }, []);

  const { reload } = useAsyncRequest({
    args: [],
    callFn: searchFunction,
    callOnInit: false,
    callback: searchCallback,
  });

  const onSearchFieldChange = (e) => {
    setSearchValue(e.target.value);
    setResults([]);
    setShowResults(false);
    setLoading(true);
  };

  const search = useCallback(() => {
    setResults([]);
    setLoading(true);
    setShowResults(false);
    const searchFilter = new FilterObjectClass({
      uid: 'search',
      field: searchFieldTargetField,
      value: searchValue,
      operator: comparisons.contains,
      type: filterTypes.text,
    });
    clearTimeout(searchTimeout.current);
    const args = searchValue ? [searchFilter] : [];
    searchTimeout.current = setTimeout(() => reload([args]), searchDelay);
  }, [searchFieldTargetField, searchValue, searchDelay, searchTimeout]);

  useEffect(() => {
    /* Set results to [] if invalid search value */
    if (isFocused && !searchValue && !allowEmptySearch) setResults([]);
  }, [isFocused, searchValue, allowEmptySearch]);

  useEffect(() => {
    /* Set results to [] if loading */
    if (isFocused && loading) {
      setResults([]);
      setShowResults(false);
    }
  }, [isFocused, loading]);

  useEffect(() => {
    /* Show results if focused */
    if (isFocused && (searchValue || allowEmptySearch) && results?.length > 0) setShowResults(true);
  }, [isFocused, searchValue, allowEmptySearch, results]);

  useEffect(() => {
    /* Repeat search when focused */
    if ((searchValue || allowEmptySearch) && isFocused) {
      search();
    }
    return () => {
      clearTimeout(searchTimeout.current);
    };
  }, [searchValue, reload, searchFieldTargetField, allowEmptySearch, isFocused, searchDelay]);

  const mappedResults = useMemo(() => {
    if (Array.isArray(labelField)) {
      return Array.isArray(results)
        ? results.map((r) => ({
            uid: r.uid,
            label: labelField.map((L) => r[L]).join(' | '),
          }))
        : [];
    }
    return Array.isArray(results)
      ? results.map((r) => ({
          uid: r.uid,
          label: r[labelField],
        }))
      : [];
  }, [labelField, results]);

  const handleListItemSelect = (selectedId) => {
    if (!loading) {
      const selectedData = results.find((r) => r.uid == selectedId);
      if (!selectedData) throw Error('Selected item not found');
      setIsFocused(false);
      setShowResults(false);
      setSearchValue(selectedData[labelField]);
      goBackToSearchField();
      handleSelect(selectedId, selectedData);
    }
  };

  const handleCancel = () => {
    setShowResults(false);
    setIsFocused(false);
    setLoading(false);
  };

  const handleInputKeyDown = (e) => {
    /* When in search field */
    if (e.key === 'Enter') {
      e.preventDefault();
      setShowResults(true);
    }
    if (e.key === 'Escape' || e.key === 'Tab') {
      handleCancel();
    }
    if (e.key === 'ArrowDown') {
      if (mappedResults && mappedResults.length > 0) {
        e.preventDefault();
        if (showResults && !loading) {
          firstItemRef.current.focus();
        } else {
          setShowResults(true);
        }
      }
    }
  };

  const classNames = [className, 'sas_drop_wrap', valid ? '' : 'invalid']
    .filter((a) => a)
    .join(' ');


  const handleEnterSearchField = () => {
    setIsFocused(true);
  };

  const handleClickDropdownBtn = () => {
    setIsFocused(true);
    goBackToSearchField();
  };

  const handleDropdownClose = () => {
    handleCancel()
  };

  return (
    <div className={classNames}>
      <div className="searchFieldWrap" style={{ border: isFocused ? '1px solid red' : '' }}>
        <input
          className="searchField"
          style={{ flexGrow: 1 }}
          type="text"
          placeholder={searchFieldPlaceholder}
          value={searchValue || ''}
          onChange={onSearchFieldChange}
          onFocus={handleEnterSearchField}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleInputKeyDown}
          ref={searchFieldRef}
        />
        {!loading && (
          <button type="button" className="dropdownBtn" onClick={handleClickDropdownBtn}>
            \/
          </button>
        )}
        <div className="sas_drop_loadingWrap">
          <LoadingIcon isLoading={loading} />
        </div>
      </div>
      <CustomSelectDropdown
        options={mappedResults}
        isOpen={showResults}
        handleSelect={(uid) => handleListItemSelect(uid)}
        handleClose={handleDropdownClose}
        firstItemRef={firstItemRef}
        goBackToSearchField={goBackToSearchField}
      />
    </div>
  );
};

const selectionShape = {};

SearchAndSelectDropdown.propTypes = {
  searchFunction: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
  selectionOverride: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape(selectionShape)),
    PropTypes.shape(selectionShape),
  ]),
  allowMultiple: PropTypes.bool,
  returnFieldOnSelect: PropTypes.string,
  searchFieldTargetField: PropTypes.string,
  labelField: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
    .isRequired,
  className: PropTypes.string,
  searchFieldPlaceholder: PropTypes.string,
  allowEmptySearch: PropTypes.bool,
  searchDelay: PropTypes.number,
  callOnInit: PropTypes.bool,
};

SearchAndSelectDropdown.defaultProps = {
  selectionOverride: null,
  allowMultiple: false,
  returnFieldOnSelect: 'uid',
  searchFieldTargetField: 'label',
  className: '',
  searchFieldPlaceholder: 'search...',
  allowEmptySearch: false,
  searchDelay: 500,
  callOnInit: false,
};
