/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { SearchAndSelect } from './search-and-select';
import {
  demoResultData,
  demoHeadingsData,
  demoPreviewHeadingsData,
  demoResultsDataMany,
} from './demo-data';
import { demoFiltersData, demoFieldsData } from '@samnbuk/react_db_client.constants.demo-data';

const LiveUpdateBtn = ({ liveUpdate, setLiveUpdate }) => (
  <button
    type="button"
    className={liveUpdate ? 'button-two' : 'button-one'}
    onClick={() => setLiveUpdate(!liveUpdate)}
  >
    Live Update
  </button>
);

const defaultSearchFn = async () =>
  new Promise((resolve) => setTimeout(() => resolve(demoResultData), 2000));

const searchFnManyResults = async () =>
  new Promise((resolve) => setTimeout(() => resolve(demoResultsDataMany), 2000));

const defaultProps = {
  searchFunction: defaultSearchFn,
  initialFilters: demoFiltersData,
  availableFilters: demoFieldsData,
  handleSelect: (id) => alert(`Selected: ${id}`),
  headings: demoHeadingsData,
  debug: true,
};

export const CompDemoData = () => {
  const [liveUpdate, setLiveUpdate] = useState(false);
  const props = { ...defaultProps, autoUpdate: liveUpdate };
  return (
    <div>
      <LiveUpdateBtn {...{ liveUpdate, setLiveUpdate }} />
      <SearchAndSelect {...props} />
    </div>
  );
};
export const SearchField = () => {
  const [liveUpdate, setLiveUpdate] = useState(false);
  const props = {
    ...defaultProps,
    autoUpdate: liveUpdate,
    showSearchField: true,
    searchFieldTargetField: 'name',
  };
  return (
    <div>
      <LiveUpdateBtn {...{ liveUpdate, setLiveUpdate }} />
      <SearchAndSelect {...props} />
    </div>
  );
};
export const DemoDataMulti = () => {
  const [liveUpdate, setLiveUpdate] = useState(false);
  const props = {
    ...defaultProps,
    autoUpdate: liveUpdate,
    allowMultiple: true,
  };
  return (
    <div>
      <LiveUpdateBtn {...{ liveUpdate, setLiveUpdate }} />
      <SearchAndSelect {...props} />
    </div>
  );
};
export const DemoDataMultiAutoupdate = () => {
  const [liveUpdate, setLiveUpdate] = useState(false);
  const [selection, setSelection] = useState(null);
  const props = {
    ...defaultProps,
    autoUpdate: liveUpdate,
    allowMultiple: true,
  };
  return (
    <div>
      <LiveUpdateBtn {...{ liveUpdate, setLiveUpdate }} />
      <SearchAndSelect
        {...props}
        handleSelect={(uids, data) => setSelection(uids)}
        liveUpdate
        allowMultiple
      />
      <button type="button" className="button-one" onClick={() => alert(selection)}>
        Accept selection
      </button>
      {JSON.stringify(selection)}
    </div>
  );
};
export const DemoDataRefreshBtn = () => {
  const [liveUpdate, setLiveUpdate] = useState(false);
  const props = {
    ...defaultProps,
    autoUpdate: liveUpdate,
    showRefreshBtn: true,
  };
  return (
    <div>
      <LiveUpdateBtn {...{ liveUpdate, setLiveUpdate }} />
      <SearchAndSelect {...props} />
    </div>
  );
};
export const DemoDataUseNameAsSelectionField = () => {
  const [liveUpdate, setLiveUpdate] = useState(false);
  const props = {
    ...defaultProps,
    autoUpdate: liveUpdate,
    showRefreshBtn: true,
    allowMultiple: true,
    returnFieldOnSelect: 'name',
  };
  return (
    <div>
      <LiveUpdateBtn {...{ liveUpdate, setLiveUpdate }} />
      <SearchAndSelect {...props} />
    </div>
  );
};
export const SelectionPreview = () => {
  const [liveUpdate, setLiveUpdate] = useState(false);
  const props = {
    ...defaultProps,
    autoUpdate: liveUpdate,
    showSearchField: true,
    searchFieldTargetField: 'name',
  };
  return (
    <div>
      <LiveUpdateBtn {...{ liveUpdate, setLiveUpdate }} />
      <SearchAndSelect allowSelectionPreview previewHeadings={demoPreviewHeadingsData} {...props} />
    </div>
  );
};
export const SelectionPreviewManyResults = () => {
  const [liveUpdate, setLiveUpdate] = useState(false);
  const props = {
    ...defaultProps,
    autoUpdate: liveUpdate,
    showSearchField: true,
    searchFieldTargetField: 'name',
    previewHeadings: demoPreviewHeadingsData,
    allowSelectionPreview: true,
    searchFunction: searchFnManyResults,
    limitResultHeight: 100,
  };
  return (
    <div>
      <LiveUpdateBtn {...{ liveUpdate, setLiveUpdate }} />
      <SearchAndSelect {...props} />
    </div>
  );
};
