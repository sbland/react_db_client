import React, { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import { demoTableData, demoHeadingsData, demoFiltersData } from '../demoData';
import DataTableWrapper from '../DataTableWrapper';
import { dataTableDefaultConfig } from '../DataTableConfig/DataTableConfig';
import Form from '../../Form/Form';
import useDataManager from './DataManager';
import useAsyncRequest from '../../AsyncRequestManager';

function timeout(response, ms) {
  return new Promise((resolve) => setTimeout(() => resolve(response), ms));
}

const DEMO_TABLE_DATA = Object.values(demoTableData);

const DEMO_CONFIG = {
  ...dataTableDefaultConfig,
  showTable: false,
  showTopMenu: true,
  showBottomMenu: true,
};
const DEMO_SORT_BY = { heading: 'count', direction: 1, map: null };

const DemoComponent = () => {
  const [data, setData] = useState(DEMO_TABLE_DATA);
  const [filters, setFilters] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const {
    dataUnProcessed,
    dataProcessed,
    totals,
    unsavedChanges,
    updateRowData,
    handleValueChange,
    handleValueAccept,
    handleValueReset,
    handleAddRow,
    handleDeleteRow,
    resetData,
    error,
  } = useDataManager({
    data,
    headings: demoHeadingsData,
    filters,
    sortBy,
    calculateTotals: false,
    autoSave: false,
  });
  return (
    <>
      <button
        type="button"
        className="button-one"
        onClick={() => setFilters(filters.length ? [] : demoFiltersData)}
      >
        setFilters
      </button>
      <button
        type="button"
        className="button-one"
        onClick={() => setSortBy(sortBy ? null : DEMO_SORT_BY)}
      >
        Set Sort by
      </button>
      <button type="button" className="button-one" onClick={() => handleAddRow()}>
        Add row
      </button>
      <div>{JSON.stringify(dataProcessed)}</div>
      <div className="">ROW COUNT: {dataProcessed.length}</div>
    </>
  );
};
storiesOf('Data Table Data Manager', module)
  .add('default', () => (
    <p>
      <DemoComponent />
    </p>
  ))
  .add('Simple', () => {
    const [data, setData] = useState(DEMO_TABLE_DATA);
    return (
      <>
        <DataTableWrapper
          data={data}
          headings={demoHeadingsData}
          config={DEMO_CONFIG}
          sortByOverride={DEMO_SORT_BY}
          saveData={setData}
          calculateTotals
        />
        <div>{JSON.stringify(data)}</div>
      </>
    );
  })
  .add('Simple autosave', () => {
    const [data, setData] = useState(DEMO_TABLE_DATA);
    const handleSave = (newData) => {
      console.log('Saving');
      setData(newData);
    };
    return (
      <>
        <DataTableWrapper
          data={data}
          headings={demoHeadingsData}
          config={DEMO_CONFIG}
          sortByOverride={DEMO_SORT_BY}
          autoSave
          saveData={handleSave}
          calculateTotals
        />
        <div>{JSON.stringify(data)}</div>
      </>
    );
  })
  .add('Simple autosave modify', () => {
    const [data, setData] = useState(DEMO_TABLE_DATA);

    return (
      <>
        <DataTableWrapper
          data={data}
          headings={demoHeadingsData}
          config={{ ...DEMO_CONFIG, autoSave: true }}
          sortByOverride={DEMO_SORT_BY}
          // autoSave
          saveData={setData}
          calculateTotals
        />
        <div>{JSON.stringify(data)}</div>
        <Form
          formDataInitial={data[0]}
          headings={demoHeadingsData}
          onSubmit={(d) => setData((prev) => [d.formData].concat(prev.slice(1)))}
          onChange={() => {}}
          showEndBtns
        />
      </>
    );
  })
  .add('Simple autosave modify b', () => {
    const [data, setData] = useState(DEMO_TABLE_DATA);

    return (
      <>
        <DataTableWrapper
          data={data}
          headings={demoHeadingsData}
          config={{ ...DEMO_CONFIG, autoSave: true }}
          sortByOverride={DEMO_SORT_BY}
          // autoSave
          saveData={setData}
          calculateTotals
        />
        <div>{JSON.stringify(data)}</div>
        <Form
          formDataInitial={data[0]}
          headings={demoHeadingsData}
          onSubmit={(d) => setData((prev) => [d.formData].concat(prev.slice(1)))}
          onChange={() => {}}
          showEndBtns
        />
      </>
    );
  })
  .add('with async loader', () => {
    const {
      response: tableData,
      error: costLoadingError,
      reload: reloadCostData,
      loading,
    } = useAsyncRequest({
      args: [],
      callFn: async () => timeout(DEMO_TABLE_DATA, 100),
    });
    const sortBy = {
      heading: 'a',
      direction: true,
    };

    const {
      dataUnProcessed,
      dataProcessed,
      totals,
      unsavedChanges,
      // updateRowData,
      handleValueChange,
      handleValueAccept,
      handleValueReset,
      // handleAddRow,
      // handleDeleteRow,
      resetData,
      // error,
    } = useDataManager({
      data: tableData,
      headings: demoHeadingsData,
      filters: [],
      sortBy,
      calculateTotals: true,
      autoSave: false,
      autofilter: false,
    });
    return (
      <div>
        <div className="">{JSON.stringify(dataUnProcessed)}</div>
        <div className="">{JSON.stringify(dataProcessed)}</div>
        <div className="">{JSON.stringify(totals)}</div>
      </div>
    );
  });
