/** A react hook to manage data for the data table
 *
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { TCustomFilter, deepIsEqual, filterData } from '@react_db_client/helpers.filter-helpers';
import { FilterObjectClass, Uid } from '@react_db_client/constants.client-types';
import {
  IRowErrorObject,
  calculateColumnTotals,
  evaluateExpressionColumns,
  evaluateRow,
  // filterTableData,
  generateNewRowData,
  sortTableData,
  validateCell,
  validateRows,
} from './processTableData';
import { IHeadingEvaluate, IRow, ISortBy, SAVE_ACTIONS, THeading } from '../lib';

const handleUpdateEvalField = <IRowCustom extends IRow = IRow>(
  heading: IHeadingEvaluate,
  prevRowData: IRowCustom,
  colId: Uid,
  newVal: any
) => {
  if (!heading.expressionReversed)
    throw Error(`expressionReversed has not been defined for heading: ${heading.uid}`);
  const patterns = heading.expressionReversed.split(';');
  const prevRowDataWithNewValue = { ...prevRowData, [colId]: newVal };
  const updatedRowData = patterns.reduce((acc, patternFull) => {
    if (!patternFull) throw Error('Missing Pattern');
    const [targetField, pattern] = patternFull.split('=');
    if (!pattern) throw new Error(`Pattern is invalid: ${patternFull}`);
    const patternFixed = pattern.replace('$_', `$${heading.uid}`);
    const newData = { ...acc };
    newData[targetField.replace('$', '')] = evaluateRow(patternFixed, prevRowDataWithNewValue);
    return newData;
  }, {});
  const newRowData = { ...prevRowData, ...updatedRowData };
  return newRowData;
};

export interface IUseDataManagerArgs<IRowCustom extends IRow = IRow> {
  /* Input data */
  data: IRowCustom[];
  /* Headings list */
  headings: THeading[];
  /* Active filters */
  filters: FilterObjectClass[];
  /* Current sort by info */
  sortBy?: null | ISortBy;
  /* If true then calculate column totals */
  calculateTotals?: boolean;
  /* If true then recalculate data after each change */
  recalculate?: boolean;
  /* If true then save data after each change */
  autoSave?: boolean;
  /** If true then save data after creating a new row */
  autoSaveOnNewRow?: boolean;
  /** Callback to save data */
  autoSaveCallback?: (data, action: string, newData?, rowId?: Uid, colIds?: Uid[]) => void;
  /** If true then sort data on load */
  autoSort?: boolean;
  /** If true then filter data on load */
  autoFilter?: boolean;
  /** If true then the data is controlled by the parent component */
  isControlled?: boolean;
  /* Callback to save totals */
  saveTotalsCallback?: (totals) => void;
  /* Callback when a cell is updated */
  updatedDataHook?: (row: Uid, column: Uid, field: Uid) => void;
  /* Dictionary of custom filter functions(See filterDataFunc) */
  customFilters: { [k: Uid]: TCustomFilter };
}

export interface IUseDataManagerReturn<IRowCustom extends IRow = IRow> {
  /* Unprocessed data */
  dataUnProcessed: IRowCustom[];
  /* Processed data */
  dataProcessed: IRowCustom[];
  /* List of invalid rows */
  invalidRows: boolean[];
  /* List of invalid rows and messages */
  invalidRowsMessages: (null | IRowErrorObject)[];
  /* Totals object */
  totals: { [x: Uid]: number } | null;
  /* True if there are unsaved changes */
  unsavedChanges: boolean;
  /* Update row data */
  updateRowData: null | {
    rowId: Uid;
    rowData: IRowCustom;
    rowIndex: number;
  };
  /* Handle value change */
  handleValueChange: (
    newVal: any,
    rowId: Uid,
    rowIndex: number,
    colId: Uid
  ) => void | Promise<void>;
  /* Handle value accept */
  handleValueAccept: (
    newVal: any,
    rowId: Uid,
    rowIndex: number,
    colId: Uid
  ) => void | Promise<void>;
  /* Handle value reset */
  handleValueReset: (rowId: Uid, rowIndex: number, colId: Uid) => void | Promise<void>;
  /* Handle save data */
  handleSaveData: () => void | Promise<void>;
  /* Handle add row */
  handleAddRow: () => void | Promise<void>;
  /* Handle delete row */
  handleDeleteRow: (rowId: Uid, rowIndex: number) => void | Promise<void>;
  /* Reset data */
  resetData: () => void | Promise<void>;
  /* Error ref */
  error: React.MutableRefObject<string | null>;
} /* Unprocessed data */

/**
 * Used by data table to process data
 *
 */
export const useDataManager = <IRowCustom extends IRow = IRow>({
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
  isControlled = false,
  saveTotalsCallback = (_totals) => {},
  updatedDataHook = (_row, _column, _field) => {},
  customFilters,
}: IUseDataManagerArgs<IRowCustom>): IUseDataManagerReturn => {
  const error = React.useRef<string | null>(null);
  const [rawData, setRawData] = useState<IRowCustom[]>(dataIn);
  const [sortBy, setSortBy] = useState<ISortBy | null>(() => sortByIn || null);

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  // TODO: Implement trigger filter and sort
  // const [triggerFilter, setTriggerFilter] = useState(false);
  // const [triggerSort, setTriggerSort] = useState(false);

  /* Internal processed data */
  /* This is the sorted and filtered data */
  const [intProcessedData, setIntProcessedData] = useState<IRowCustom[]>([]);

  // const  validatedData = useMemo(() => {
  //   // TODO: Run validateTableData
  //   return rawData;
  // }
  // , [rawData]);

  useEffect(() => {
    setSortBy(sortByIn || null);
  }, [sortByIn]);

  useEffect(() => {
    if (dataIn) {
      setRawData((prev) => {
        if (isControlled) return dataIn;
        if (deepIsEqual(dataIn, prev)) return prev;
        return dataIn;
      });
    }
  }, [dataIn]);

  // Process filters and sorting then update in processed state
  useEffect(() => {
    if (rawData) {
      // if ((!filters || filters.length === 0) && !sortBy) setIntProcessedData(rawData);
      let updatedData = rawData.map((row, i) => ({ ...row, _rowIndex: i })); // store pre sort and filter index
      if (recalculate && autoFilter && filters.length > 0) {
        updatedData = filterData(customFilters || {})(filters, updatedData);
      }
      if (recalculate && autoSort && sortBy) {
        updatedData = sortTableData(updatedData, sortBy);
      }
      setIntProcessedData(updatedData);
    }
  }, [recalculate, rawData, filters, autoFilter, sortBy, autoSort, customFilters]);

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

  /**
   * Handle value change
   * @param newVal
   * @param rowId - row UID
   * @param rowIndex - index of row in data(post sort and filter)
   * @param colId
   * @returns
   * @description
   * - Update the data in the table
   * - If autoSave is on then call the autoSaveCallback
   * - If autoSave is off then update the data in the table
   * - If the heading is an evaluate heading then we need to process the reverse evaluation
   */
  const handleValueChange = useCallback(
    (newVal: any, rowId: Uid, rowIndex: number, colId: Uid) => {
      // Note use of callback here ensures if multiple columns are updated
      // in one we update all and don't override the data object
      // Changing intProcessed data here ensures that we don't re-run sorting and filtering
      setIntProcessedData((prev) => {
        const heading = headings.find((h) => h.uid === colId);
        if ((heading as IHeadingEvaluate).evaluateType) {
          // if the heading type is an evaluate heading we need to process
          // the reverse evaluation
          const prevRowData = prev.find((row) => row.uid === rowId) as IRowCustom;
          const newRowData = handleUpdateEvalField(
            heading as IHeadingEvaluate,
            prevRowData,
            colId,
            newVal
          );
          const dataMod = Object.assign([], prev, { [rowIndex]: newRowData });
          return dataMod;
        }
        const newRowData = { ...prev[rowIndex], [colId]: newVal };
        const dataMod = Array.from(prev);
        dataMod.splice(rowIndex, 1, newRowData);
        return dataMod;
      });
    },
    [headings]
  );

  /**
   * Handle value accept
   * @param newVal
   * @param rowId - row UID
   * @param rowIndex - index of row in data(post sort and filter)
   * @param colId
   * @returns
   * @description
   * - Update the data in the table after accepting a cell value
   *
   *
   * Note use of callback here ensures if multiple columns are updated
   * in one we update all and don't override the data object
   */
  const handleValueAccept = useCallback(
    (newVal: any, rowId: Uid, rowIndex: number, colId: Uid) => {
      const liveData = isControlled ? dataIn : rawData;

      // Original data is unsorted so not in sync with rowIndex arg above
      // TODO: We should switch out sorted row index for unsorted row index
      const originalRowIndex = liveData.findIndex((rowData) => rowData.uid === rowId);
      const oldRowData = liveData[originalRowIndex];
      const oldVal = oldRowData[colId];
      if (oldVal === newVal) return; // don't do anything if value hasn't changed
      // TODO: Handle evaluated values
      // TODO: Handle validating values here
      const heading = headings.find((h) => h.uid === colId);
      const [isValid, message] = validateCell(heading as THeading, newVal, {
        ...rawData[rowIndex],
        ...evaluatedData[rowIndex],
      });
      let newValValidated = newVal;
      if (!isValid) {
        // TODO: Implement multiple validation procedures
        alert(message?.text);
        newValValidated = oldVal;
      }

      if (autoSave && autoSaveCallback) {
        const newRowData = { ...liveData[originalRowIndex], [colId]: newValValidated };
        const dataMod = Object.assign([], liveData, { [originalRowIndex]: newRowData });
        autoSaveCallback(dataMod, SAVE_ACTIONS.ROW_CHANGED, newRowData, rowId, [colId]);
      }
      if (isControlled) {
        // pass
      } else {
        const originalRowIndexPrev = rawData.findIndex((rowData) => rowData.uid === rowId);
        const prevRowData = rawData[originalRowIndexPrev];
        const newRowData = (heading as IHeadingEvaluate).evaluateType
          ? handleUpdateEvalField(heading as IHeadingEvaluate, prevRowData, colId, newValValidated)
          : { ...prevRowData, [colId]: newValValidated };
        const dataMod = Object.assign([], rawData, { [originalRowIndexPrev]: newRowData });
        setRawData(dataMod);
        setUnsavedChanges(true);
        updatedDataHook(rowId, colId, newValValidated);
      }
    },
    [autoSave, rawData, dataIn, autoSaveCallback, headings, updatedDataHook, evaluatedData]
  );

  const handleValueReset = (rowId, rowIndex, colId) => {
    setIntProcessedData((prev) => {
      const originalRowIndex = rawData.findIndex((rowData) => rowData.uid === rowId);
      const originalValue = rawData[originalRowIndex][colId];
      const newRowData = { ...prev[rowIndex], [colId]: originalValue };
      const dataMod = Object.assign([], prev, { [rowIndex]: newRowData });
      return dataMod;
    });
  };

  const deleteRow = (rowId, _rowIndex) => {
    const liveData = isControlled ? dataIn : rawData;
    if ((autoSave || autoSaveOnNewRow) && autoSaveCallback) {
      // Original data is unsorted so not in sync with rowIndex arg above
      const originalRowIndex = liveData.findIndex((rowData) => rowData.uid === rowId);
      const dataCopy = liveData
        .slice(0, originalRowIndex)
        .concat(liveData.slice(originalRowIndex + 1));
      autoSaveCallback(dataCopy, SAVE_ACTIONS.ROW_DELETED, null, rowId);
    }
    if (!isControlled) {
      setRawData((prev) => {
        const originalRowIndex = prev.findIndex((rowData) => rowData.uid === rowId);
        const dataCopy = prev.slice(0, originalRowIndex).concat(prev.slice(originalRowIndex + 1));
        return dataCopy;
      });
      setUnsavedChanges(true);
    }
  };

  const handleSaveData = () => {
    if (autoSaveCallback) autoSaveCallback(rawData, SAVE_ACTIONS.SAVE_BTN_CLICKED);
    setUnsavedChanges(false);
  };

  const handleAddRow = () => {
    const liveData = isControlled ? dataIn : rawData;
    const newRowData = generateNewRowData(headings);
    if ((autoSave || autoSaveOnNewRow) && autoSaveCallback) {
      const newData = [...liveData, newRowData];
      autoSaveCallback(newData, SAVE_ACTIONS.ROW_ADDED, newRowData, newRowData.uid);
    }
    if (!isControlled) {
      setRawData((prev) => {
        // TODO: We should have all headings here
        const newData = [...prev, newRowData];
        return newData;
      });
      setUnsavedChanges(true);
    }
  };

  const resetData = () => {
    setRawData(dataIn);
    setUnsavedChanges(false);
  };

  if (
    (autoSave || autoSaveOnNewRow) &&
    (!autoSaveCallback || typeof autoSaveCallback !== 'function')
  ) {
    throw Error('Missing autosave callback');
  }

  return {
    dataUnProcessed: rawData,
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
