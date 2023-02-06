/** A react hook to manage data for the data table
 *
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { deepIsEqual, filterData } from '@react_db_client/helpers.filter-helpers';
import {
  calculateColumnTotals,
  evaluateExpressionColumns,
  evaluateRow,
  // filterTableData,
  generateNewRowData,
  sortTableData,
  validateRows,
} from './processTableData';
import { FilterObjectClass, Uid } from '@react_db_client/constants.client-types';

const handleUpdateEvalField = (heading, prevRowData, colId, newVal) => {
  if (!heading.expressionReversed)
    throw Error(`expressionReversed has not been defined for heading: ${heading.uid}`);
  const patterns = heading.expressionReversed.split(';');
  const prevRowDataWithNewValue = { ...prevRowData, [colId]: newVal };
  const updatedRowData = patterns.reduce((acc, patternFull) => {
    if (!patternFull) throw Error('Missing Pattern');
    const [targetField, pattern] = patternFull.split('=');
    const patternFixed = pattern.replace('$_', `$${heading.uid}`);
    const newData = { ...acc };
    newData[targetField.replace('$', '')] = evaluateRow(patternFixed, prevRowDataWithNewValue);
    return newData;
  }, {});
  const newRowData = { ...prevRowData, ...updatedRowData };
  return newRowData;
};

export enum ESaveAction {
  ROW_CHANGED = 'rowChanged',
  ROW_DELETED = 'rowDeleted',
  SAVE_BTN_CLICKED = 'saveBtnClicked',
  ROW_ADDED = 'rowAdded',
}

export const SAVE_ACTIONS = {
  ROW_CHANGED: 'rowChanged',
  ROW_DELETED: 'rowDeleted',
  SAVE_BTN_CLICKED: 'saveBtnClicked',
  ROW_ADDED: 'rowAdded',
};

export interface IUseDataManagerArgs {
  data;
  headings;
  filters: FilterObjectClass[];
  sortBy?: string;
  calculateTotals?: boolean;
  recalculate?: boolean;
  autoSave?: boolean;
  autoSaveOnNewRow?: boolean;
  autoSaveCallback?: (data, action: string, newData?, rowId?: number, colIds?: Uid[]) => void;
  autoSort?: boolean;
  autoFilter?: boolean;
  saveTotalsCallback: (totals) => void;
  updatedDataHook: (row: Uid, column: number, field: Uid) => void;
  customFilters: { [k: Uid]: FilterObjectClass };
}

type RowData = any;

/**
 * Used by data table to process data
 *
 * Merge edit and start data
 *  also process any evaluate cells
 *
 * @param {
 *  data - Input data
 *  headings - Headings list
 *  filters{Array[FilterObjectClass]} - active filters
 *  sortBy - Current sort by heading id
 *  calculateTotals{bool} - If true then calculate column totals
 *  autoSave{bool}
 *  autoSaveOnNewRow{bool}
 *  autoSaveCallback{func}
 *  autoSort{bool}
 *  autoFilter{bool}
 *  saveTotalsCallback{func}
 *  updatedDataHook{func}
 *  customFilters{dict} - dictionary of custom filter functions(See filterDataFunc)
 * }
 * @returns
 */
const useDataManager = ({
  data: dataIn,
  headings,
  filters,
  sortBy: sortByIn,
  calculateTotals = false,
  recalculate = true,
  autoSave = false,
  autoSaveOnNewRow = false,
  autoSaveCallback,
  autoSort = true,
  autoFilter = true,
  // eslint-disable-next-line no-unused-vars
  saveTotalsCallback = (_totals) => {},
  // eslint-disable-next-line no-unused-vars
  updatedDataHook = (_row, _column, _field) => {},
  customFilters,
}: IUseDataManagerArgs) => {
  const error = React.useRef<string | null>(null);
  const [intData, setIntData] = useState<RowData[]>(dataIn);
  const [sortBy, setSortBy] = useState<string | null>(() => sortByIn || null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  // TODO: Implement trigger filter and sort
  // const [triggerFilter, setTriggerFilter] = useState(false);
  // const [triggerSort, setTriggerSort] = useState(false);

  const [intProcessedData, setIntProcessedData] = useState<RowData[]>([]);

  useEffect(() => {
    setSortBy(sortByIn || null);
  }, [sortByIn]);

  useEffect(() => {
    if (dataIn) {
      // TODO: Check this is not causing multiple renders!
      setIntData((prev) => {
        if (deepIsEqual(dataIn, prev)) return prev;
        return dataIn;
      });
    }
  }, [dataIn]);

  // Process filters and sorting then update in processed state
  useEffect(() => {
    if (intData) {
      // if ((!filters || filters.length === 0) && !sortBy) setIntProcessedData(intData);
      let updatedData = intData;
      if (recalculate && autoFilter && filters.length > 0) {
        updatedData = filterData(customFilters || {})(filters, updatedData);
      }
      if (recalculate && autoSort && sortBy) {
        updatedData = sortTableData(updatedData, sortBy);
      }
      setIntProcessedData(updatedData);
    }
  }, [recalculate, intData, filters, autoFilter, sortBy, autoSort, customFilters]);

  // Evaluate data
  const evaluatedData = useMemo(
    () => (recalculate ? evaluateExpressionColumns(intProcessedData, headings) : intProcessedData),
    [recalculate, intProcessedData, headings]
  );

  // Calculate Totals
  const totals = useMemo<{ [x: Uid]: number } | null>(() => {
    if (!calculateTotals || !recalculate) return null;
    const summableHeadingTypes = ['number'];
    const numberColumns = headings
      .filter((heading) => heading.showTotals || summableHeadingTypes.indexOf(heading.type) !== -1)
      .map((heading) => heading.uid);

    const totalsCalculated = calculateColumnTotals(evaluatedData, numberColumns);
    if (saveTotalsCallback) saveTotalsCallback(totalsCalculated);
    return totalsCalculated;
  }, [recalculate, evaluatedData, headings, calculateTotals, saveTotalsCallback]);

  const [invalidRows, invalidRowsMessages] = useMemo(() => {
    if (!recalculate) return [[], []];
    return validateRows(headings, evaluatedData);
  }, [recalculate, evaluatedData, headings]);
  if (!intProcessedData) error.current = 'Data is invalid';
  if (!headings) error.current = 'Input headings are invalid';

  /* API */
  const handleValueChange = useCallback(
    (newVal, rowId, rowIndex, colId) => {
      // Note use of callback here ensures if multiple columns are updated
      // in one we update all and don't override the data object
      setIntProcessedData((prev) => {
        const heading = headings.find((h) => h.uid === colId);
        if (heading.evaluateType) {
          // if the heading type is an evaluate heading we need to process
          // the reverse evaluation
          const prevRowData = prev.find((row) => row.uid === rowId);
          const newRowData = handleUpdateEvalField(heading, prevRowData, colId, newVal);
          const dataMod = Object.assign([], prev, { [rowIndex]: newRowData });
          return dataMod;
        }
        const newRowData = { ...prev[rowIndex], [colId]: newVal };
        const dataMod = Object.assign([], prev, { [rowIndex]: newRowData });
        return dataMod;
      });
    },
    [headings]
  );

  const handleValueAccept = useCallback(
    (newVal, rowId, rowIndex, colId) => {
      const liveData = autoSave ? dataIn : intData;
      const originalRowIndex = liveData.findIndex((rowData) => rowData.uid === rowId);
      const oldRowData = liveData[originalRowIndex];
      if (oldRowData[colId] === newVal) return; // don't do anything if value hasn't changed
      // TODO: Handle evaluated values
      if (autoSave && autoSaveCallback) {
        // Original data is unsorted so not in sync with rowIndex arg above
        const newRowData = { ...dataIn[originalRowIndex], [colId]: newVal };
        const dataMod = Object.assign([], dataIn, { [originalRowIndex]: newRowData });
        autoSaveCallback(dataMod, SAVE_ACTIONS.ROW_CHANGED, newRowData, rowId, [colId]);
      } else {
        // Note use of callback here ensures if multiple columns are updated
        // in one we update all and don't override the data object
        const originalRowIndexPrev = intData.findIndex((rowData) => rowData.uid === rowId);
        const prevRowData = intData[originalRowIndexPrev];
        const heading = headings.find((h) => h.uid === colId);
        const newRowData = heading.evaluateType
          ? handleUpdateEvalField(heading, prevRowData, colId, newVal)
          : { ...prevRowData, [colId]: newVal };
        const dataMod = Object.assign([], intData, { [originalRowIndexPrev]: newRowData });

        setIntData(dataMod);
        // TODO: Make sure we don't need to do it as below
        // setIntData((prev) => {
        //   // Note use of callback here ensures if multiple columns are updated
        //   // in one we update all and don't override the data object
        //   const originalRowIndexPrev = prev.findIndex((rowData) => rowData.uid === rowId);
        //   const prevRowData = prev[originalRowIndexPrev];
        //   const heading = headings.find((h) => h.uid === colId);
        //   if (heading.type === filterTypes.evaluate) {
        //     const newRowData = handleUpdateEvalField(heading, prevRowData, colId, newVal);
        //     const dataMod = Object.assign([], prev, { [rowIndex]: newRowData });
        //     return dataMod;
        //   }
        //   const newRowData = { ...prevRowData, [colId]: newVal };
        //   const dataMod = Object.assign([], prev, { [originalRowIndexPrev]: newRowData });
        //   return dataMod;
        // });
        setUnsavedChanges(true);
        updatedDataHook(rowId, colId, newVal);
      }
    },
    [autoSave, intData, dataIn, autoSaveCallback, headings, updatedDataHook]
  );

  const handleValueReset = (rowId, rowIndex, colId) => {
    setIntProcessedData((prev) => {
      const originalRowIndex = intData.findIndex((rowData) => rowData.uid === rowId);
      const originalValue = intData[originalRowIndex][colId];
      const newRowData = { ...prev[rowIndex], [colId]: originalValue };
      const dataMod = Object.assign([], prev, { [rowIndex]: newRowData });
      return dataMod;
    });
  };

  // const updateRowData = (newData, rowId) => {
  //   setData((prev) => {
  //     const dataCopy = cloneDeep(prev);
  //     dataCopy[rowId] = newData;
  //     return dataCopy;
  //   });
  //   setUnsavedChanges(true);
  // };

  const deleteRow = (rowId, _rowIndex) => {
    if ((autoSave || autoSaveOnNewRow) && autoSaveCallback) {
      // Original data is unsorted so not in sync with rowIndex arg above
      const originalRowIndex = dataIn.findIndex((rowData) => rowData.uid === rowId);
      const dataCopy = intData
        .slice(0, originalRowIndex)
        .concat(intData.slice(originalRowIndex + 1));
      autoSaveCallback(dataCopy, SAVE_ACTIONS.ROW_DELETED, null, rowId);
    } else {
      setIntData((prev) => {
        const originalRowIndex = prev.findIndex((rowData) => rowData.uid === rowId);
        const dataCopy = prev.slice(0, originalRowIndex).concat(prev.slice(originalRowIndex + 1));
        return dataCopy;
      });
      setUnsavedChanges(true);
    }
  };

  const handleSaveData = () => {
    if (autoSaveCallback) autoSaveCallback(intData, SAVE_ACTIONS.SAVE_BTN_CLICKED);
    setUnsavedChanges(false);
  };

  const handleAddRow = () => {
    const newRowData = generateNewRowData(headings);
    if (autoSave || autoSaveOnNewRow) {
      const newData = [...intData, newRowData];
      if (autoSaveCallback)
        autoSaveCallback(newData, SAVE_ACTIONS.ROW_ADDED, newRowData, newRowData.uid);
    } else {
      setIntData((prev) => {
        // TODO: We should have all headings here
        const newData = [...prev, newRowData];
        return newData;
      });
      setUnsavedChanges(true);
    }
  };

  const resetData = () => {
    setIntData(dataIn);
    setUnsavedChanges(false);
  };

  if (autoSave && (!autoSaveCallback || typeof autoSaveCallback !== 'function')) {
    throw Error('Missing autosave callback');
  }

  return {
    dataUnProcessed: intData,
    // dataProcessedUnevaluated: intProcessedData,
    dataProcessed: evaluatedData,
    invalidRows,
    invalidRowsMessages,
    totals,
    unsavedChanges,
    updateRowData: null,
    handleValueChange,
    handleValueAccept,
    handleValueReset,
    handleSaveData,
    handleAddRow,
    handleDeleteRow: deleteRow,
    // callFilterData,
    // callSortdata,
    resetData,
    error,
  };
};

useDataManager.propTypes = {
  dataIn: PropTypes.arrayOf(PropTypes.object).isRequired,
  headingsData: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf([
        'text',
        'link',
        'button',
        'number',
        'popup',
        'select',
        'selectMulti',
        'entity',
        'textLong',
        'bool',
      ]).isRequired,
      action: PropTypes.func,
      to: PropTypes.string,
      hidden: PropTypes.bool,
    })
  ).isRequired,
  visableColumns: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf([
        'text',
        'link',
        'button',
        'number',
        'popup',
        'select',
        'selectMulti',
        'entity',
        'textLong',
        'bool',
      ]).isRequired,
      action: PropTypes.func,
      to: PropTypes.string,
      hidden: PropTypes.bool,
    })
  ).isRequired,
  filterData: PropTypes.objectOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      operator: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  sortBy: PropTypes.shape({
    heading: PropTypes.string.isRequired,
    direction: PropTypes.bool.isRequired,
  }),
  processTableDataFn: PropTypes.func,
  customFilters: PropTypes.objectOf(PropTypes.func),
};

export default useDataManager;
