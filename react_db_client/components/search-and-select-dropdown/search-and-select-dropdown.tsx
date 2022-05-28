import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  FilterObjectClass,
  filterTypes,
  comparisons,
} from '@react_db_client/constants.client-types';
import { AsyncRequestError, useAsyncRequest } from '@react_db_client/async-hooks.use-async-request';
import { CustomSelectDropdown } from '@react_db_client/components.custom-select-dropdown';

import { LoadingIcon } from './loading-icon';

import './style.scss';

export interface ISearchAndSelectDropdownProps<Item> {
  searchFunction: () => Promise<Item[]>;
  handleSelect: (id: string, selectedData: Item) => void;
  intitialValue?: string | Item;
  searchFieldTargetField?: string;
  labelField?: string;
  className?: string;
  searchFieldPlaceholder?: string;
  allowEmptySearch?: boolean;
  searchDelay?: number;
  valid?: boolean;
}

/**
 * Search and Select Dropdown Component
 * Dropdown selection with async data load
 */
export const SearchAndSelectDropdown = <Item,>({
  searchFunction,
  handleSelect,
  intitialValue,
  searchFieldTargetField,
  labelField,
  className,
  searchFieldPlaceholder,
  allowEmptySearch,
  searchDelay,
  valid,
}: ISearchAndSelectDropdownProps<Item>) => {
  // TODO: Provide default search function
  const [searchValue, setSearchValue] = useState<string>(() =>
    typeof intitialValue == 'string' ? intitialValue : intitialValue[searchFieldTargetField]
  );
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);
  const firstItemRef = useRef(null);
  const searchFieldRef = useRef(null);
  const searchTimeout = useRef(null);

  const goBackToSearchField = () => searchFieldRef.current.select();
  const [results, setResults] = useState([]);

  const searchCallback = useCallback((resultsNew) => {
    setResults(resultsNew);
    setLoading(false);
  }, []);

  const searchErrorCallback = useCallback((error: AsyncRequestError) => {
    setResults([]);
    setLoading(false);
    // TODO: Handle errors
  }, []);

  const { reload } = useAsyncRequest({
    args: [],
    callFn: searchFunction,
    callOnInit: false,
    callback: searchCallback,
    errorCallback: searchErrorCallback,
  });

  const onSearchFieldChange = (e) => {
    setSearchValue(e.target.value);
    setResults([]);
    setShowResults(false);
    setLoading(true);
    setHasSelected(false);
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
    if (isFocused && !searchValue && !allowEmptySearch) {
      setResults([]);
      setLoading(false);
    }
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
    if (!hasSelected && isFocused && (searchValue || allowEmptySearch) && results?.length > 0)
      setShowResults(true);
  }, [isFocused, searchValue, allowEmptySearch, results, hasSelected]);

  useEffect(() => {
    /* Repeat search when focused */
    if (!hasSelected && (searchValue || allowEmptySearch) && isFocused) {
      search();
    }
    return () => {
      clearTimeout(searchTimeout.current);
    };
  }, [
    searchValue,
    reload,
    searchFieldTargetField,
    allowEmptySearch,
    isFocused,
    searchDelay,
    hasSelected,
  ]);

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
      setHasSelected(true);
      handleSelect(selectedId, selectedData);
    }
  };

  const handleCancel = () => {
    setShowResults(false);
    setIsFocused(false);
    setLoading(false);
    setHasSelected(false);
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
    if (showResults) setShowResults(false);
    else {
      setHasSelected(false);
      setIsFocused(true);
      goBackToSearchField();
    }
  };

  const handleDropdownClose = () => {
    handleCancel();
  };

  const handleInputClick = () => {
    setIsFocused(true);
    setHasSelected(false);
  };

  return (
    <div className={classNames}>
      <div className="searchFieldWrap">
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
          onClick={handleInputClick}
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

SearchAndSelectDropdown.propTypes = {
  /* Async function to call when searching
   * Signature: async (searchText) => {}
   */
  searchFunction: PropTypes.func.isRequired,
  /* Function called when item is selected
   * Signature: (selectedId, selectedData) => {}
   */
  handleSelect: PropTypes.func.isRequired,
  /* Initial search field value */
  intitialValue: PropTypes.string,
  /* the target field that the search string applies to */
  searchFieldTargetField: PropTypes.string,
  /* The field in the returned data to use as the label */
  labelField: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
    .isRequired,
  /* Additional classnames */
  className: PropTypes.string,
  /* Search field placeholder */
  searchFieldPlaceholder: PropTypes.string,
  /* Call search even when input is empty */
  allowEmptySearch: PropTypes.bool,
  /* Delay between input and search call */
  searchDelay: PropTypes.number,
  /* Input is valid */
  valid: PropTypes.bool,
};

SearchAndSelectDropdown.defaultProps = {
  initialValue: '',
  searchFieldTargetField: 'label',
  className: '',
  searchFieldPlaceholder: 'search...',
  allowEmptySearch: false,
  searchDelay: 500,
  valid: true,
};