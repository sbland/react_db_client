/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { screen, within } from '@testing-library/react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { SearchAndSelect } from './search-and-select';
import {
  demoResultData,
  demoHeadingsData,
  demoPreviewHeadingsData,
  demoResultsDataMany,
  IResultExample,
} from './demo-data';
import { demoFiltersData, demoFieldsData } from '@react_db_client/constants.demo-data';
import { FilterObjectClass, IDocument } from '@react_db_client/constants.client-types';

const Switch = ({ liveUpdate, setLiveUpdate, text }) => (
  <button
    type="button"
    className={liveUpdate ? 'button-two' : 'button-one'}
    onClick={() => setLiveUpdate(!liveUpdate)}
  >
    {text}
  </button>
);

const defaultSearchFn = async (filter?: FilterObjectClass[]): Promise<IResultExample[]> =>
  new Promise((resolve) => setTimeout(() => resolve(demoResultData), 2000));

const defaultSearchFnNoTimeout = async (
  filter?: FilterObjectClass[]
): Promise<IResultExample[]> => new Promise((resolve) => resolve(demoResultData));

defaultSearchFn.waitForReady = async () => {
  await jest.runOnlyPendingTimers();
  const resultsList = screen.getByTestId('styledSelectList');
  await within(resultsList).findAllByText(demoResultData[0].name);
};

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

export const SearchExampleForTests = () => {
  const [liveUpdate, setLiveUpdate] = useState(false);
  const props = {
    ...defaultProps,
    handleSelect: alert,
    searchFunction: defaultSearchFnNoTimeout,
    autoUpdate: liveUpdate,
  };
  return (
    <div>
      <Switch {...{ liveUpdate, setLiveUpdate }} text="Live Update" />
      <SearchAndSelect {...props} />
    </div>
  );
};

SearchExampleForTests.waitForReady = async () => {
  await screen.findByText('No results found. Try adjusting the filters above.');
};

SearchExampleForTests.forTests = true;

export const SearchExampleForTestsAltReturnField = () => {
  const [liveUpdate, setLiveUpdate] = useState(false);
  const props = {
    ...defaultProps,
    handleSelect: alert,
    searchFunction: defaultSearchFnNoTimeout,
    autoUpdate: liveUpdate,
    returnFieldOnSelect: 'name',
  };
  return (
    <div>
      <Switch {...{ liveUpdate, setLiveUpdate }} text="Live Update" />
      <SearchAndSelect {...props} />
    </div>
  );
};

SearchExampleForTestsAltReturnField.waitForReady = async () => {
  await screen.findByText('No results found. Try adjusting the filters above.');
};
SearchExampleForTestsAltReturnField.forTests = true;

export const CompDemoData = () => {
  const [liveUpdate, setLiveUpdate] = useState(false);
  const props = {
    ...defaultProps,
    autoUpdate: liveUpdate,
  };
  return (
    <div>
      <Switch {...{ liveUpdate, setLiveUpdate }} text="Live Update" />
      <SearchAndSelect {...props} />
    </div>
  );
};

CompDemoData.waitForReady = async () => {
  await screen.findByText('No results found. Try adjusting the filters above.');
};

export const SearchField = () => {
  const [liveUpdate, setLiveUpdate] = useState(false);
  const props = {
    ...defaultProps,
    autoUpdate: liveUpdate,
    showSearchField: true,
    searchFieldTargetField: 'name',
    handleSelect: alert,
    // handleSelect: (data) => alert(`Selected: ${JSON.stringify(data)}`),
  };
  return (
    <div>
      <Switch {...{ liveUpdate, setLiveUpdate }} text="Live Update" />
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
      <Switch {...{ liveUpdate, setLiveUpdate }} text="Live Update" />
      <SearchAndSelect {...props} />
    </div>
  );
};

export const DemoDataMultiAutoupdate = () => {
  const [liveUpdate, setLiveUpdate] = useState(false);
  const [selection, setSelection] = useState<IDocument | IDocument[] | null>(null);
  const props = {
    ...defaultProps,
    autoUpdate: liveUpdate,
    allowMultiple: true,
  };
  return (
    <div>
      <Switch {...{ liveUpdate, setLiveUpdate }} text="Live Update" />
      <SearchAndSelect
        {...props}
        handleSelect={(data: IDocument | null | IDocument[]) => setSelection(data)}
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
      <Switch {...{ liveUpdate, setLiveUpdate }} text="Live Update" />
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
      <Switch {...{ liveUpdate, setLiveUpdate }} text="Live Update" />
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
      <Switch {...{ liveUpdate, setLiveUpdate }} text="Live Update" />
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
      <Switch {...{ liveUpdate, setLiveUpdate }} text="Live Update" />
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
      <Switch {...{ liveUpdate: sw, setLiveUpdate: setSw }} text="select" />
      <SearchAndSelect {...props} searchFunction={searchFn} liveUpdate />
    </div>
  );
};

SelectSearchFn.waitForReady = async () => {
  // await jest.runOnlyPendingTimers();
  const resultsList = screen.getByTestId('styledSelectList');
  await within(resultsList).findAllByText(demoResultData[0].name);
};
