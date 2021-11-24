/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { CompositionWrapDefault } from '@samnbuk/react_db_client.helpers.composition-wraps';

// eslint-disable-next-line import/no-extraneous-dependencies
import { SearchAndSelectDropdown } from './search-and-select-dropdown';
import { demoResultData } from './demo-data';

const LiveUpdateBtn = ({ liveUpdate, setLiveUpdate }) => (
  <button
    type="button"
    className={liveUpdate ? 'button-two' : 'button-one'}
    onClick={() => setLiveUpdate(!liveUpdate)}
  >
    Live Update
  </button>
);

const defaultProps = {
  searchFunction: async () =>
    new Promise((resolve) => setTimeout(() => resolve(demoResultData), 500)),
  handleSelect: (id) => alert(`Selected: ${id}`),
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
          onChange={(e) => setSearchDelay(e.target.value)}
          value={searchDelay}
        />
      </div>
      <CompositionWrapDefault height="4rem" width="4rem">
        <SearchAndSelectDropdown {...props} />
      </CompositionWrapDefault>
    </div>
  );
};

export const DemoDataMultipleLabels = () => {
  const props = { ...defaultProps, labelField: ['label', 'uid'] };
  return (
    <div>
      <SearchAndSelectDropdown {...props} allowEmptySearch />
    </div>
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
    allowMultiple: true,
    searchFunction: async () =>
      new Promise((resolve) => setTimeout(() => resolve(demoResultData), 500)),
  };
  return (
    <div>
      <SearchAndSelectDropdown {...props} allowEmptySearch />
    </div>
  );
};

export const DemoDataAllowEmptyInstant = () => {
  const props = { ...defaultProps };
  return (
    <div>
      <SearchAndSelectDropdown
        {...props}
        allowEmptySearch
        searchFunction={async () => demoResultData}
        searchDelay={0}
      />
    </div>
  );
};