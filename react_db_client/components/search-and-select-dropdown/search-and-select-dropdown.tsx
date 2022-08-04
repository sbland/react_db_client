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
import { useCombinedRefs } from '@react_db_client/hooks.use-combined-ref';

export interface ISearchAndSelectDropdownProps<Item> extends React.HTMLProps<HTMLInputElement> {
  searchFunction: () => Promise<Item[]>;
  handleSelect: (id: string, selectedData: Item) => void;
  debug?: boolean;
  initialValue?: string | Item;
  searchFieldTargetField?: string;
  labelField?: string;
  className?: string;
  searchFieldPlaceholder?: string;
  allowEmptySearch?: boolean;
  searchDelay?: number;
  allowMultiple?: boolean;
  valid?: boolean;
  searchFieldRef?: React.MutableRefObject<HTMLInputElement | null> | null;
}

export interface IItem {
  uid: string | number;
}

// TODO: Provide default search function

/**
 * Search and Select Dropdown Component
 * Dropdown selection with async data load
 */
export const SearchAndSelectDropdown = <Item extends IItem>(
  props: ISearchAndSelectDropdownProps<Item>
) => {
  const {
    searchFunction,
    handleSelect,
    initialValue,
    debug,
    searchFieldTargetField = 'field',
    labelField = 'label',
    className,
    searchFieldPlaceholder,
    allowEmptySearch,
    searchDelay,
    allowMultiple,
    valid = true,
    style,
    searchFieldRef: searchFieldRefFromParent,
    ...additionalProps
  } = props;
  if (allowMultiple) throw Error('Multiple Selection Is Not Implemented');
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);
  const firstItemRef = useRef<HTMLElement | null>(null);
  const searchFieldRef = useRef<HTMLInputElement>(null);
  const searchFieldRefsCombined = useCombinedRefs(searchFieldRefFromParent, searchFieldRef);
  const searchTimeout: React.MutableRefObject<ReturnType<typeof setTimeout> | null> = useRef(null);
  const goBackToSearchField = () =>
    searchFieldRefsCombined.current && searchFieldRefsCombined.current.select();
  const [results, setResults] = useState<Item[]>([]);

  React.useEffect(() => {
    setSearchValue(
      initialValue === null || initialValue === undefined || typeof initialValue !== 'object'
        ? initialValue || ''
        : initialValue[searchFieldTargetField]
    );
  }, [initialValue, searchFieldTargetField]);

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
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current as NodeJS.Timeout);
    }
    const args = searchValue ? [searchFilter] : [];
    searchTimeout.current = setTimeout(
      () => reload([args]),
      searchDelay
    ) as unknown as NodeJS.Timeout;
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
      clearTimeout((searchTimeout.current as NodeJS.Timeout) || undefined);
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

  const handleListItemSelect = React.useCallback(
    (selectedId) => {
      if (!loading) {
        const selectedData = results.find((r) => r.uid == selectedId);
        if (!selectedData) throw Error('Selected item not found');
        setIsFocused(false);
        setShowResults(false);
        setSearchValue(selectedData[labelField]);
        goBackToSearchField();
        setHasSelected(true);
        handleSelect(selectedId, selectedData);
      } else {
        console.log('loading');
      }
    },
    [loading, results, goBackToSearchField, handleSelect]
  );

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
          firstItemRef.current?.focus();
        } else {
          setShowResults(true);
        }
      }
    }
  };

  const classNames = [className, 'sas_drop_wrap ', valid ? '' : 'invalid']
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
          ref={searchFieldRefsCombined}
          onClick={handleInputClick}
          {...additionalProps}
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
        position="relative"
      />
    </div>
  );
};

// TODO: prop types causing issue with ...rest

const ValueTypes = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.shape({
    uid: PropTypes.string,
    // TODO: Define initial value shape requirements
  }),
]);

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
  initialValue: PropTypes.oneOfType([ValueTypes, PropTypes.arrayOf(ValueTypes)]),
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
  /* If true allows multiple selection */
  allowMultiple: PropTypes.bool,
};

SearchAndSelectDropdown.defaultProps = {
  searchFieldTargetField: 'label',
  className: '',
  searchFieldPlaceholder: 'search...',
  allowEmptySearch: false,
  searchDelay: 500,
  valid: true,
  initialValue: null,
  allowMultiple: false,
};
