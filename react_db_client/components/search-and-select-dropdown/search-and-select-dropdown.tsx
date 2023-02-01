import React, {
  useLayoutEffect,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  FilterObjectClass,
  EComparisons,
} from '@react_db_client/constants.client-types';
import {
  AsyncRequestError,
  useAsyncRequest,
} from '@react_db_client/async-hooks.use-async-request';
import { CustomSelectDropdown } from '@react_db_client/components.custom-select-dropdown';
import { useCombinedRefs } from '@react_db_client/hooks.use-combined-ref';
import { EFilterType } from '@react_db_client/constants.client-types';

import { LoadingIcon } from './loading-icon';
import {
  DropdownBtn,
  SasDropLoadingWrap,
  SasDropWrap,
  SearchFieldWrapStyle,
} from './styles';

export interface IItem {
  uid: string | number;
  label: string;
}

export type SelectFn<T extends IItem> = (selectedData: T) => void;

export interface ISearchAndSelectDropdownProps<Item extends IItem>
  extends React.HTMLProps<HTMLInputElement> {
  searchFunction: (filters?: FilterObjectClass[]) => Promise<Item[]>;
  handleSelect: (selectedData: Item) => void;
  debug?: boolean;
  initialValue?: null | string | Item;
  searchFieldTargetField?: string;
  labelField?: string | string[];
  className?: string;
  searchFieldPlaceholder?: string;
  allowEmptySearch?: boolean;
  autoFocusOnFirstItem?: boolean;
  searchDelay?: number;
  allowMultiple?: boolean;
  valid?: boolean;
  searchFieldRef?: React.MutableRefObject<HTMLInputElement | null> | null;
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
    autoFocusOnFirstItem,
    valid = true,
    style,
    searchFieldRef: searchFieldRefFromParent,
    ...additionalProps
  } = props;
  if (allowMultiple) throw Error('Multiple Selection Is Not Implemented');
  const [searchValue, setSearchValue] = useState<string | number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [waitForInput, setWaitForInput] = useState(false);
  const firstItemRef = useRef<HTMLElement | null>(null);
  const searchFieldRef = useRef<HTMLInputElement>(null);
  const searchFieldRefsCombined = useCombinedRefs(
    searchFieldRefFromParent,
    searchFieldRef
  );
  const searchTimeout: React.MutableRefObject<ReturnType<
    typeof setTimeout
  > | null> = useRef(null);

  const [results, setResults] = useState<Item[]>([]);
  const isTypingTypingRef: React.MutableRefObject<ReturnType<
    typeof setTimeout
  > | null> = React.useRef(null);
  const [isTyping, setIsTyping] = React.useState(false);

  React.useEffect(() => {
    setSearchValue(
      initialValue === null ||
        initialValue === undefined ||
        typeof initialValue !== 'object'
        ? initialValue || ''
        : initialValue[searchFieldTargetField]
    );
  }, [initialValue, searchFieldTargetField]);

  const searchCallback = useCallback((resultsNew) => {
    // console.info(resultsNew)
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
    setIsTyping(true);
    setShowResults(false);
    setLoading(true);
    setWaitForInput(false);
  };

  useEffect(() => {
    if (isTyping) {
      isTypingTypingRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 100);
    }
    return () => {
      if (isTypingTypingRef?.current) clearTimeout(isTypingTypingRef.current);
    };
  }, [isTyping]);

  const search = useCallback(() => {
    setResults([]);
    setLoading(true);
    setShowResults(false);
    const searchFilter = new FilterObjectClass({
      uid: 'search',
      field: searchFieldTargetField,
      value: searchValue,
      operator: EComparisons.CONTAINS,
      type: EFilterType.text,
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
    if (
      !isTyping &&
      !waitForInput &&
      isFocused &&
      (searchValue || allowEmptySearch) &&
      results?.length > 0
    )
      setShowResults(true);
  }, [
    isTyping,
    isFocused,
    searchValue,
    allowEmptySearch,
    results,
    waitForInput,
  ]);

  useLayoutEffect(() => {
    if (autoFocusOnFirstItem && mappedResults && firstItemRef?.current) {
      firstItemRef.current.focus();
    }
  }, [autoFocusOnFirstItem, showResults]);

  useEffect(() => {
    /* Repeat search when focused */
    if (!waitForInput && (searchValue || allowEmptySearch) && isFocused) {
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
    waitForInput,
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

  const goBackToSearchField = () => {
    setWaitForInput(true);
    searchFieldRefsCombined.current && searchFieldRefsCombined.current.select();
    setShowResults(false);
  };

  const handleListItemSelect = React.useCallback(
    (selectedId) => {
      if (!loading) {
        const selectedData = results.find((r) => r.uid == selectedId);
        if (!selectedData) throw Error('Selected item not found');
        setIsFocused(false);
        setShowResults(false);
        setSearchValue(
          selectedData[Array.isArray(labelField) ? labelField[0] : labelField]
        );
        goBackToSearchField();
        setWaitForInput(true);
        handleSelect(selectedData);
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
    setWaitForInput(false);
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
      goBackToSearchField();
      setWaitForInput(false);
      setIsFocused(true);
    }
  };

  const handleDropdownClose = () => {
    handleCancel();
  };

  const handleInputClick = () => {
    setIsFocused(true);
    setWaitForInput(false);
  };
  return (
    <SasDropWrap className={classNames}>
      <SearchFieldWrapStyle className="searchFieldWrap">
        <input
          className="searchField"
          style={{ flexGrow: 1 }}
          type="text"
          // aria-label="Search input for selection dropdown"
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
          <DropdownBtn
            type="button"
            name="Show Results"
            aria-label="Show Results"
            className="dropdownBtn"
            onClick={handleClickDropdownBtn}
          >
            \/
          </DropdownBtn>
        )}
        <SasDropLoadingWrap className="sas_drop_loadingWrap">
          <LoadingIcon isLoading={loading} />
        </SasDropLoadingWrap>
      </SearchFieldWrapStyle>
      <CustomSelectDropdown
        options={mappedResults}
        isOpen={showResults}
        handleSelect={(uid) => handleListItemSelect(uid)}
        handleClose={handleDropdownClose}
        firstItemRef={firstItemRef}
        goBackToSearchField={goBackToSearchField}
        position="relative"
      />
    </SasDropWrap>
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
  initialValue: PropTypes.oneOfType([
    ValueTypes,
    PropTypes.arrayOf(ValueTypes),
  ]),
  /* the target field that the search string applies to */
  searchFieldTargetField: PropTypes.string,
  /* The field in the returned data to use as the label */
  labelField: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
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
