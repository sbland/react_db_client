import React from 'react';
import ReactJson from 'react-json-view';
import useDataManager from './DataManager';
import { demoHeadingsData, demoTableData } from '../demoData';
import { IRow } from '../lib';

const headings = demoHeadingsData;
const filters = [];
const sortBy = null;
const calculateTotals = false;
const autoSave = false;
const saveTotalsCallback = () => {};
const customFilters = {};
const updatedDataHook = () => {};

const exampleData = demoTableData;

export const DemoDataManager = () => {
  const [data, setData] = React.useState<IRow[]>([]);

  const {
    // dataUnProcessed,
    dataProcessed,
    totals,
    unsavedChanges,
    // updateRowData,
    handleValueChange,
    handleValueAccept,
    handleValueReset,
    handleAddRow,
    handleDeleteRow,
    resetData,
    handleSaveData,
    invalidRowsMessages,
  } = useDataManager({
    data,
    headings,
    filters,
    sortBy,
    calculateTotals,
    autoSave,
    // autoSaveOnNewRow,
    // autoSaveCallback,
    // autoSort,
    // autoFilter,
    saveTotalsCallback,
    updatedDataHook,
    customFilters,
  });

  return (
    <div>
      <div>
        <button onClick={() => setData([])}>Reset Data</button>
        <button onClick={() => setData(exampleData)}>Reset Data 2</button>
        <button onClick={() => handleAddRow()}>Add row</button>
      </div>
      <div>
        {dataProcessed.map((d) => (
          <div key={d.uid} data-testid={`row_${d.uid}`}>
            <p>{d.uid}</p>
            <ReactJson src={d} />
          </div>
        ))}
      </div>
    </div>
  );
};
