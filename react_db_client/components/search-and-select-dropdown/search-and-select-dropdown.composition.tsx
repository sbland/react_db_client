/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { CompositionWrapDefault } from '@react_db_client/helpers.composition-wraps';

// eslint-disable-next-line import/no-extraneous-dependencies
import { SearchAndSelectDropdown } from './search-and-select-dropdown';
import { demoResultData, IResultExample } from './demo-data';

const defaultProps = {
  searchFunction: async (): Promise<IResultExample[]> =>
    new Promise((resolve) => setTimeout(() => resolve(demoResultData), 500)),
  // handleSelect: (id) => alert(`Selected: ${id}`),
  handleSelect: (id) => {},
  labelField: 'label',
  debug: true,
  searchFieldTargetField: 'label',
};

export const DemoData = () => {
  const [allowEmptySearch, setAllowEmptySearch] = useState(false);
  const [searchDelay, setSearchDelay] = useState(500);
  const props = { ...defaultProps, allowEmptySearch, searchDelay };
  return (
    <div className="">
      <div className="">
        <button
          type="button"
          className={allowEmptySearch ? 'button-two' : 'button-one'}
          onClick={() => setAllowEmptySearch((prev) => !prev)}
        >
          Allow empty Search
        </button>
        <label>Search Delay</label>
        <input
          type="number"
          name="searchDelay"
          onChange={(e) => setSearchDelay(parseInt(e.target.value))}
          value={searchDelay}
        />
      </div>
      <label htmlFor="searchInput">Search Dropdown Example</label>
      <CompositionWrapDefault height="4rem" width="8rem">
        <SearchAndSelectDropdown {...props} id="searchInput" style={{ background: 'red' }} />
      </CompositionWrapDefault>
    </div>
  );
};

export const DemoDataMultipleLabels = () => {
  const props = { ...defaultProps, labelField: ['label', 'uid'] };
  return (
    <CompositionWrapDefault height="4rem" width="8rem">
      <SearchAndSelectDropdown {...props} allowEmptySearch />
    </CompositionWrapDefault>
  );
};

export const DemoDataAltLabel = () => {
  const results = demoResultData.map((item) => ({
    ...item,
    label: null,
    name: item.label,
  }));
  const props = {
    ...defaultProps,
    labelField: 'name',
    // allowMultiple: true,
    searchFunction: async (): Promise<IResultExample[]> =>
      new Promise((resolve) => setTimeout(() => resolve(demoResultData), 500)),
  };
  return (
    <CompositionWrapDefault height="4rem" width="8rem">
      <SearchAndSelectDropdown {...props} allowEmptySearch />
    </CompositionWrapDefault>
  );
};

export const DemoDataAllowEmptyInstant = () => {
  const props = { ...defaultProps };
  return (
    <CompositionWrapDefault height="4rem" width="8rem">
      <SearchAndSelectDropdown
        {...props}
        allowEmptySearch
        searchFunction={async () => demoResultData}
        searchDelay={0}
      />
    </CompositionWrapDefault>
  );
};

export const DemoDataSetInitial = () => {
  const props = { ...defaultProps };
  return (
    <CompositionWrapDefault height="4rem" width="8rem">
      <SearchAndSelectDropdown
        {...props}
        initialValue="hello"
        allowEmptySearch
        searchFunction={async () => demoResultData}
        searchDelay={0}
      />
    </CompositionWrapDefault>
  );
};
