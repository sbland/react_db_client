/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { ISearchAndSelectProps, SearchAndSelect } from './search-and-select';
import {
  demoResultData,
  demoHeadingsData,
  demoPreviewHeadingsData,
  demoResultsDataMany,
  IResultExample,
} from './demo-data';
import { demoFiltersData, demoFieldsData } from '@react_db_client/constants.demo-data';
import { FilterObjectClass } from '@react_db_client/constants.client-types';
import { IResult } from './lib';

const Select = ({ liveUpdate, setLiveUpdate }) => (
  <button
    type="button"
    className={liveUpdate ? 'button-two' : 'button-one'}
    onClick={() => setLiveUpdate(!liveUpdate)}
  >
    Select
  </button>
);

const defaultSearchFn = async (filter?: FilterObjectClass[]): Promise<IResultExample[]> =>
  new Promise((resolve) => setTimeout(() => resolve(demoResultData), 2000));

const searchFnManyResults = async (): Promise<IResultExample[]> =>
  new Promise((resolve) => setTimeout(() => resolve(demoResultsDataMany), 2000));

const defaultProps = {
  searchFunction: defaultSearchFn,
  initialFilters: demoFiltersData,
  availableFilters: demoFieldsData,
  handleSelect: (data) => alert(`Selected: ${data}`),
  headings: demoHeadingsData,
  previewHeadings: demoPreviewHeadingsData,
};

export const CompDemoData = () => {
  const [liveUpdate, setLiveUpdate] = useState(false);
  const props = {
    ...defaultProps,
    autoUpdate: liveUpdate,
  };
  return (
    <div>
      <Select {...{ liveUpdate, setLiveUpdate }} />
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
    handleSelect: (data) => alert(`Selected: ${data}`),
  };
  return (
    <div>
      <Select {...{ liveUpdate, setLiveUpdate }} />
      <SearchAndSelect {...props} />
    </div>
  );
};
export const DemoDataMulti = () => {
  const [liveUpdate, setLiveUpdate] = useState(false);
  const props = {
    ...defaultProps,
    autoUpdate: liveUpdate,
    allowMultiple: true as true,
    handleSelect: (data) => alert(`Selected: ${data}`),
  };
  return (
    <div>
      <Select {...{ liveUpdate, setLiveUpdate }} />
      <SearchAndSelect {...props} />
    </div>
  );
};
export const DemoDataMultiAutoupdate = () => {
  const [liveUpdate, setLiveUpdate] = useState(false);
  const [selection, setSelection] = useState<IResult | IResult[] | null>(null);
  const props = {
    ...defaultProps,
    autoUpdate: liveUpdate,
    allowMultiple: true,
  };
  return (
    <div>
      <Select {...{ liveUpdate, setLiveUpdate }} />
      <SearchAndSelect
        {...props}
        handleSelect={(data: IResult | null | IResult[]) => setSelection(data)}
        liveUpdate
        allowMultiple={true}
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
      <Select {...{ liveUpdate, setLiveUpdate }} />
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
    handleSelect: (data) => alert(`Selected: ${data}`),
  };
  return (
    <div>
      <Select {...{ liveUpdate, setLiveUpdate }} />
      <SearchAndSelect {...props} />
    </div>
  );
};
export const SelectionPreview = () => {
  const [liveUpdate, setLiveUpdate] = useState(false);
  const props = {
    ...defaultProps,
    handleSelect: (data) => alert(`Selected: ${data}`),
    autoUpdate: liveUpdate,
    showSearchField: true,
    searchFieldTargetField: 'name',
  };
  return (
    <div>
      <Select {...{ liveUpdate, setLiveUpdate }} />
      <SearchAndSelect allowSelectionPreview {...props} previewHeadings={demoPreviewHeadingsData} />
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
      <Select {...{ liveUpdate, setLiveUpdate }} />
      <SearchAndSelect {...props} />
    </div>
  );
};

export const SelectSearchFn = () => {
  const [sw, setSw] = useState(true);
  const props = {
    ...defaultProps,
    autoUpdate: true,
  };

  const searchFn = sw ? defaultProps.searchFunction : searchFnManyResults;
  return (
    <div>
      <Select {...{ liveUpdate: sw, setLiveUpdate: setSw }} />
      <SearchAndSelect {...props} searchFunction={searchFn} liveUpdate />
    </div>
  );
};
