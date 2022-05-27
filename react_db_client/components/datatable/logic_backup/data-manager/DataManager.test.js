import { renderHook } from '@testing-library/react-hooks';
import useDataManager, { SAVE_ACTIONS } from './DataManager';
import filterDataFunc from '../../FilterManager/filterDataFunc';
import {
  demoFiltersData,
  demoTableDataEvaluatedSimple,
  demoTableDataSimple,
  demoHeadingsDataSimple,
  demoDataSimpleTotals,
} from '../demoData';

import {
  sortTableData,
  evaluateExpressionColumns,
  calculateColumnTotals,
  generateNewRowData,
  evaluateRow,
} from './processTableData';

jest.mock('../../FilterManager/filterDataFunc');

jest.mock('./processTableData', () => ({
  __esModule: true,
  default: jest.fn(),
  filterDataFunc: jest.fn(),
  sortTableData: jest.fn(),
  evaluateExpressionColumns: jest.fn(),
  calculateColumnTotals: jest.fn(),
  generateNewRowData: jest.fn(),
  evaluateRow: jest.fn().mockReturnValue(1234),
  validateRows: jest.fn().mockReturnValue([[], []]),
}));

const mockAutoSaveCallback = jest.fn();
const mockSaveTotalsCallback = jest.fn();
const mockUpdatedDataHook = jest.fn();

Date.now = jest.fn().mockImplementation(() => 0);

const DEMO_HEADINGS = demoHeadingsDataSimple;
const DEMO_FILTERS_LIST = Object.values(demoFiltersData);
const DEMO_SORT_BY = { heading: 'count', direction: 1, map: null };

const DEMO_DATA = demoTableDataSimple;
const DEMO_DATA_FILTERED = DEMO_DATA.slice(1);
const DEMO_DATA_SORTED = DEMO_DATA_FILTERED.sort((rowA, rowB) => rowA.count > rowB.count);
const DEMO_DATA_EVALUATED = demoTableDataEvaluatedSimple;
// const DEMO_DATA_PROCESSED = Object.values(demoTableDataProcessedSimple);
const DEMO_TOTALS = demoDataSimpleTotals;
const DEMO_NEW_ROW_DATA = {
  uid: 'row_01',
  name: 'New Row',
  description: 'new row info',
  count: 10,
};

const DEMO_NUMBER_COLUMNS = DEMO_HEADINGS.filter(
  (heading) => ['number'].indexOf(heading.type) !== -1
).map((heading) => heading.uid);

// Mod targets
const MOD_INDEX = 1;
const MOD_ROW_ID = DEMO_DATA_SORTED[MOD_INDEX].uid;
const MOD_HEADING_INDEX = 1;
const MOD_VAL = 'new-val';
const COLUMN_ID_MOD = DEMO_HEADINGS[MOD_HEADING_INDEX].uid;

// Modified data
const ROW_DATA_MOD = { ...DEMO_DATA_SORTED[MOD_INDEX], [COLUMN_ID_MOD]: MOD_VAL };
const ORIGINAL_DATA_ROW_MOD_INDEX = DEMO_DATA.findIndex((d) => d.uid === MOD_ROW_ID);
const DEMO_DATA_MOD = Object.assign([], DEMO_DATA, { [ORIGINAL_DATA_ROW_MOD_INDEX]: ROW_DATA_MOD });
const DEMO_DATA_SORTED_MOD = Object.assign([], DEMO_DATA_SORTED, { [MOD_INDEX]: ROW_DATA_MOD });
const DEMO_DATA_EVALUATED_MOD = Object.assign([], DEMO_DATA_EVALUATED, {
  [MOD_INDEX]: ROW_DATA_MOD,
});

// TODO: Check works with count
const valueChangeArgs = (newVal = MOD_VAL) => ({
  newVal,
  rowId: MOD_ROW_ID,
  rowIndex: MOD_INDEX,
  columnId: COLUMN_ID_MOD,
});
const valueChangeArgsValues = (newVal = MOD_VAL) => Object.values(valueChangeArgs(newVal));

const valueResetArgs = Object.values({
  rowId: MOD_ROW_ID,
  rowIndex: MOD_INDEX,
  columnId: COLUMN_ID_MOD,
});

const EXPECTED_OUTPUT_FIELDS = [
  'dataUnProcessed',
  'dataProcessed',
  'invalidRows',
  'invalidRowsMessages',
  'totals',
  'unsavedChanges',
  'updateRowData',
  'handleValueChange',
  'handleValueAccept',
  'handleValueReset',
  'handleSaveData',
  'handleAddRow',
  'handleDeleteRow',
  'resetData',
  'error',
];

const defaultProps = {
  data: DEMO_DATA,
  headings: DEMO_HEADINGS,
  filters: DEMO_FILTERS_LIST,
  sortBy: DEMO_SORT_BY,
  calculateTotals: true, // Calculate totals
  autoSave: false, // autosave
  autoSaveCallback: mockAutoSaveCallback,
  autoSort: true, // autosort
  autoFilter: true, // autofilter
  saveTotalsCallback: mockSaveTotalsCallback,
  updatedDataHook: mockUpdatedDataHook,
};

const defaultPropsDontSortOrFilter = {
  data: DEMO_DATA,
  headings: DEMO_HEADINGS,
  filters: DEMO_FILTERS_LIST,
  sortBy: DEMO_SORT_BY,
  calculateTotals: true, // Calculate totals
  autoSave: false, // autosave
  autoSaveCallback: mockAutoSaveCallback,
  autoSort: false, // autosort
  autoFilter: false, // autofilter
  saveTotalsCallback: mockSaveTotalsCallback,
  updatedDataHook: mockUpdatedDataHook,
};

const defaultPropsAutosave = {
  data: DEMO_DATA,
  headings: DEMO_HEADINGS,
  filters: DEMO_FILTERS_LIST,
  sortBy: DEMO_SORT_BY,
  calculateTotals: true, // Calculate totals
  autoSave: true, // autosave
  autoSaveCallback: mockAutoSaveCallback,
  autoSort: true, // autosort
  autoFilter: true, // autofilter
  saveTotalsCallback: mockSaveTotalsCallback,
  updatedDataHook: mockUpdatedDataHook,
};

const filterDataFuncInner = jest.fn();

describe('useDataManager', () => {
  describe('Autosave off', () => {
    let renderedHook;
    let rerenderHook;
    beforeEach(() => {
      mockAutoSaveCallback.mockClear();
      mockSaveTotalsCallback.mockClear();
      mockUpdatedDataHook.mockClear();
      filterDataFuncInner.mockClear().mockReturnValue(DEMO_DATA_FILTERED);
      filterDataFunc.mockClear().mockReturnValue(filterDataFuncInner);
      sortTableData.mockClear().mockReturnValue(DEMO_DATA_SORTED);
      evaluateExpressionColumns.mockClear().mockReturnValue(DEMO_DATA_EVALUATED);
      calculateColumnTotals.mockClear().mockReturnValue(DEMO_TOTALS);
      generateNewRowData.mockClear().mockReturnValue(DEMO_NEW_ROW_DATA);
      const { result, rerender } = renderHook((props) => useDataManager(props), {
        initialProps: defaultProps,
      });
      renderedHook = result;
      rerenderHook = rerender;
    });
    describe('Process Data', () => {
      test('should return correct fields', () => {
        expect(Object.keys(renderedHook.current)).toEqual(EXPECTED_OUTPUT_FIELDS);
        expect(typeof renderedHook.current.resetData).toEqual('function');
      });
      test('should return unprocessed data', () => {
        expect(renderedHook.current.dataUnProcessed).toEqual(DEMO_DATA);
      });
      test('should call data filter func', async () => {
        expect(filterDataFuncInner).toHaveBeenCalledWith(DEMO_FILTERS_LIST, DEMO_DATA);
      });
      test('should call data sort func', async () => {
        expect(sortTableData).toHaveBeenCalledWith(DEMO_DATA_FILTERED, DEMO_SORT_BY);
      });
      test('should call evaluate data func', () => {
        expect(evaluateExpressionColumns).toHaveBeenCalledWith(DEMO_DATA_SORTED, DEMO_HEADINGS);
      });
      test('should return processed data', () => {
        expect(renderedHook.current.dataProcessed).toEqual(DEMO_DATA_EVALUATED);
      });
      test('should call calculate totals function', () => {
        expect(calculateColumnTotals).toHaveBeenCalledWith(
          DEMO_DATA_EVALUATED,
          DEMO_NUMBER_COLUMNS
        );
      });
      test('should return totals data', () => {
        expect(renderedHook.current.totals).toEqual(DEMO_TOTALS);
      });
    });
    describe('Auto sort off', () => {
      beforeEach(() => {
        filterDataFuncInner.mockClear();
        sortTableData.mockClear();
        rerenderHook(defaultPropsDontSortOrFilter);
      });
      test('should not call data filter func', async () => {
        expect(filterDataFuncInner).not.toHaveBeenCalled();
      });
      test('should call data sort func', async () => {
        expect(sortTableData).not.toHaveBeenCalled();
      });
      // TODO: Implement filter and sort triggers
      // test('should call data filter func when filter data fn called', async () => {
      //   renderedHook.current.callFilterData();
      //   expect(filterDataFunc)
      //     .toHaveBeenCalledWith(DEMO_FILTERS_LIST, DEMO_DATA);
      // });
      // test('should call data sort func when sort data fn called', async () => {
      //   renderedHook.current.callSortData();
      //   expect(sortTableData)
      //     .toHaveBeenCalledWith(DEMO_DATA_FILTERED, DEMO_SORT_BY);
      // });
    });
    describe('managing value changes', () => {
      test('should merge update data but not re-sort or re-filter', () => {
        filterDataFuncInner.mockClear();
        sortTableData.mockClear();
        renderedHook.current.handleValueChange(...valueChangeArgsValues());
        expect(filterDataFuncInner).not.toHaveBeenCalled();
        expect(sortTableData).not.toHaveBeenCalled();
      });
      test('should merge update data and re evaluate cells and totals', () => {
        evaluateExpressionColumns.mockClear().mockReturnValue(DEMO_DATA_EVALUATED_MOD);
        calculateColumnTotals.mockClear().mockReturnValue({ newData: 'totals' });
        renderedHook.current.handleValueChange(...valueChangeArgsValues());

        expect(evaluateExpressionColumns).toHaveBeenCalledWith(DEMO_DATA_SORTED_MOD, DEMO_HEADINGS);
        expect(calculateColumnTotals).toHaveBeenCalledWith(
          DEMO_DATA_EVALUATED_MOD,
          DEMO_NUMBER_COLUMNS
        );
        expect(renderedHook.current.dataProcessed).toEqual(DEMO_DATA_EVALUATED_MOD);
      });
      test('should not switch unsaved changes hook on modify value', () => {
        expect(renderedHook.current.unsavedChanges).toEqual(false);
        renderedHook.current.handleValueChange(...valueChangeArgsValues());
        expect(renderedHook.current.unsavedChanges).toEqual(false);
      });
    });
    describe('Accepting value changes', () => {
      test('should merge new value and re-sort and re-filter', () => {
        filterDataFuncInner.mockClear().mockReturnValue({ data: 'filtered' }); // Just mocked to Check
        sortTableData.mockClear();
        renderedHook.current.handleValueAccept(...valueChangeArgsValues());
        expect(filterDataFuncInner).toHaveBeenCalledWith(DEMO_FILTERS_LIST, DEMO_DATA_MOD);
        expect(sortTableData).toHaveBeenCalledWith({ data: 'filtered' }, DEMO_SORT_BY);
      });
      test('should merge update data and re evaluate cells and totals', () => {
        // We are just checking the flow here so do not need actual mocks
        filterDataFuncInner.mockClear().mockReturnValue({ newData: 'filtered' });
        sortTableData.mockClear().mockReturnValue({ newData: 'sorted' });
        evaluateExpressionColumns.mockClear().mockReturnValue({ newData: 'evaluated' });
        calculateColumnTotals.mockClear().mockReturnValue({ newData: 'totals' });
        renderedHook.current.handleValueAccept(...valueChangeArgsValues());
        expect(evaluateExpressionColumns).toHaveBeenCalledWith(
          { newData: 'sorted' },
          DEMO_HEADINGS
        );
        expect(calculateColumnTotals).toHaveBeenCalledWith(
          { newData: 'evaluated' },
          DEMO_NUMBER_COLUMNS
        );
        expect(renderedHook.current.dataProcessed).toEqual({ newData: 'evaluated' });
      });
      test('should switch unsaved changes hook on accept value', () => {
        expect(renderedHook.current.unsavedChanges).toEqual(false);
        renderedHook.current.handleValueAccept(...valueChangeArgsValues());
        expect(renderedHook.current.unsavedChanges).toEqual(true);
      });
      test('should call updatedDataHook when value change accepted', () => {
        // TODO: Implement this
        const valueAcceptArgs = valueChangeArgsValues();
        renderedHook.current.handleValueAccept(...valueAcceptArgs);
        expect(mockUpdatedDataHook).toHaveBeenCalledWith(
          valueAcceptArgs[1],
          valueAcceptArgs[3],
          valueAcceptArgs[0]
        );
      });
    });
    describe('Resetting value changes', () => {
      test('should reset value to original value', () => {
        renderedHook.current.handleValueChange(...valueChangeArgsValues());
        filterDataFuncInner.mockClear();
        sortTableData.mockClear();
        renderedHook.current.handleValueReset(...valueResetArgs);
        expect(filterDataFuncInner).not.toHaveBeenCalled();
        expect(sortTableData).not.toHaveBeenCalled();
      });
      test('should merge update data and re evaluate cells and totals', () => {
        renderedHook.current.handleValueChange(...valueChangeArgsValues());
        expect(evaluateExpressionColumns).toHaveBeenCalledWith(DEMO_DATA_SORTED_MOD, DEMO_HEADINGS);
        evaluateExpressionColumns.mockClear().mockReturnValue({ newData: 'evaluated' });
        calculateColumnTotals.mockClear().mockReturnValue({ newData: 'totals' });
        renderedHook.current.handleValueReset(...valueResetArgs);
        // Evaluated datacalled again with the original sorted data
        expect(evaluateExpressionColumns).toHaveBeenCalledWith(DEMO_DATA_SORTED, DEMO_HEADINGS);
        expect(calculateColumnTotals).toHaveBeenCalledWith(
          { newData: 'evaluated' },
          DEMO_NUMBER_COLUMNS
        );
        expect(renderedHook.current.dataProcessed).toEqual({ newData: 'evaluated' });
      });
      test('should not switch unsaved changes hook on reset value', () => {
        expect(renderedHook.current.unsavedChanges).toEqual(false);
        renderedHook.current.handleValueReset(...valueResetArgs);
        expect(renderedHook.current.unsavedChanges).toEqual(false);
      });
    });
    describe('accepting a value should adjust where we reset to', () => {
      test('should return the accepted value to unprocessed data', () => {
        // 1. Accept some change
        evaluateExpressionColumns.mockClear();
        renderedHook.current.handleValueAccept(...valueChangeArgsValues());
        expect(renderedHook.current.dataUnProcessed).toEqual(DEMO_DATA_MOD);

        // 2. Make another modification
        const newValB = 'Another value';
        renderedHook.current.handleValueChange(...valueChangeArgsValues(newValB));
        const MOD_B = { ...DEMO_DATA_SORTED_MOD[MOD_INDEX], [COLUMN_ID_MOD]: newValB };
        expect(evaluateExpressionColumns).toHaveBeenCalled();
        expect(evaluateExpressionColumns.mock.calls[0][0][MOD_INDEX]).toEqual(MOD_B);
        evaluateExpressionColumns.mockClear();

        // 3. Reset the change
        // // Check that when we now reset we get the result from the first accept call
        renderedHook.current.handleValueReset(...valueResetArgs);
        expect(evaluateExpressionColumns.mock.calls[0][0][MOD_INDEX]).toEqual(
          DEMO_DATA_SORTED_MOD[MOD_INDEX]
        );
      });
    });

    describe('saving data', () => {
      test('should call save data input function and set unsaved data to false', () => {
        const dataToSave = [...DEMO_DATA];
        const index = dataToSave.findIndex((p) => p.uid === MOD_ROW_ID);
        dataToSave[index] = { ...dataToSave[index], [COLUMN_ID_MOD]: MOD_VAL };
        renderedHook.current.handleValueAccept(...valueChangeArgsValues());
        expect(renderedHook.current.unsavedChanges).toEqual(true);
        renderedHook.current.handleSaveData();
        expect(mockAutoSaveCallback).toHaveBeenCalledWith(
          dataToSave,
          SAVE_ACTIONS.SAVE_BTN_CLICKED
        );
        expect(renderedHook.current.unsavedChanges).toEqual(false);
      });
    });

    describe('Update a full row at once', () => {
      // TODO: Implement this feature
    });

    describe('Adding a new row', () => {
      test('should add a new row on add row fn call', () => {
        filterDataFuncInner.mockClear();
        renderedHook.current.handleAddRow();
        expect(generateNewRowData).toHaveBeenCalledWith(DEMO_HEADINGS);
        expect(filterDataFuncInner.mock.calls[0][1].length).toEqual(DEMO_DATA.length + 1);
        const newData = [...DEMO_DATA, DEMO_NEW_ROW_DATA];
        expect(filterDataFuncInner.mock.calls[0][1]).toEqual(newData);
      });
      test('should call save when we add a new row', async () => {
        rerenderHook({ ...defaultProps, autoSaveOnNewRow: true });
        const newData = [...DEMO_DATA, DEMO_NEW_ROW_DATA];
        renderedHook.current.handleAddRow();
        expect(mockAutoSaveCallback).toHaveBeenCalledWith(
          newData,
          SAVE_ACTIONS.ROW_ADDED,
          DEMO_NEW_ROW_DATA,
          DEMO_NEW_ROW_DATA.uid
        );
      });

      test('should be able to modify an added row', () => {
        filterDataFuncInner.mockClear();
        renderedHook.current.handleAddRow();
        filterDataFuncInner.mockClear();
        const newVal = 'new val';
        renderedHook.current.handleValueAccept(
          newVal,
          DEMO_NEW_ROW_DATA.uid,
          DEMO_DATA.length,
          COLUMN_ID_MOD
        );
        const newData = [...DEMO_DATA, { ...DEMO_NEW_ROW_DATA, [COLUMN_ID_MOD]: newVal }];
        expect(filterDataFuncInner.mock.calls[0][1]).toEqual(newData);
      });
    });

    describe('Deleting a row', () => {
      test('should remove a row on delete fn call', () => {
        filterDataFuncInner.mockClear();
        renderedHook.current.handleDeleteRow(MOD_ROW_ID, MOD_INDEX);
        expect(filterDataFuncInner.mock.calls[0][1].length).toEqual(DEMO_DATA.length - 1);
        const dataCopy = DEMO_DATA.slice(0, ORIGINAL_DATA_ROW_MOD_INDEX).concat(
          DEMO_DATA.slice(ORIGINAL_DATA_ROW_MOD_INDEX + 1)
        );
        expect(filterDataFuncInner.mock.calls[0][1]).toEqual(dataCopy);
      });
    });

    describe('Resetting data', () => {
      test('should reset data to initial state if not saved', () => {
        filterDataFuncInner.mockClear();
        renderedHook.current.handleValueAccept(...valueChangeArgsValues());
        expect(filterDataFuncInner).toHaveBeenCalledWith(DEMO_FILTERS_LIST, DEMO_DATA_MOD);
        renderedHook.current.resetData();
        expect(filterDataFuncInner).toHaveBeenCalledWith(DEMO_FILTERS_LIST, DEMO_DATA);
      });
    });
    describe('Managing value changes on eval fields', () => {
      test('should call update row data with changed precedents', () => {
        evaluateExpressionColumns.mockClear().mockReturnValue(DEMO_DATA_EVALUATED_MOD);
        calculateColumnTotals.mockClear().mockReturnValue({ newData: 'totals' });
        const newVal = 999;
        const rowId = DEMO_DATA[1].uid;
        const rowIndex = 1;
        const columnId = 'eval';
        renderedHook.current.handleValueChange(...[newVal, rowId, rowIndex, columnId]);
        expect(evaluateRow).toHaveBeenCalledWith('$eval - 1', { ...DEMO_DATA[1], eval: newVal });
      });
    });
  });

  // =========== AUTO SAVE ON ============= //
  // =========== ============ ============= //
  // =========== ============ ============= //
  // =========== ============ ============= //

  describe('Autosave On', () => {
    let renderedHook;
    let rerenderHookFn;
    // let waitForNextUpdate;
    beforeEach(() => {
      mockAutoSaveCallback.mockClear();
      filterDataFuncInner.mockClear().mockReturnValue(DEMO_DATA_FILTERED);
      sortTableData.mockClear().mockReturnValue(DEMO_DATA_SORTED);
      evaluateExpressionColumns.mockClear().mockReturnValue(DEMO_DATA_EVALUATED);
      calculateColumnTotals.mockClear().mockReturnValue(DEMO_TOTALS);
      const { result, rerender } = renderHook((props) => useDataManager(props), {
        initialProps: defaultPropsAutosave,
      });
      renderedHook = result;
      rerenderHookFn = rerender;
      // waitForNextUpdate = w;
    });
    describe('Process Data', () => {
      test('should return correct fields', () => {
        expect(Object.keys(renderedHook.current)).toEqual(EXPECTED_OUTPUT_FIELDS);
      });
      test('should return unprocessed data', () => {
        expect(renderedHook.current.dataUnProcessed).toEqual(DEMO_DATA);
      });
      test('should call data filter func', async () => {
        expect(filterDataFuncInner).toHaveBeenCalledWith(DEMO_FILTERS_LIST, DEMO_DATA);
      });
      test('should call data sort func', async () => {
        expect(sortTableData).toHaveBeenCalledWith(DEMO_DATA_FILTERED, DEMO_SORT_BY);
      });
      test('should call evaluate data func', () => {
        expect(evaluateExpressionColumns).toHaveBeenCalledWith(DEMO_DATA_SORTED, DEMO_HEADINGS);
      });
      test('should return processed data', () => {
        expect(renderedHook.current.dataProcessed).toEqual(DEMO_DATA_EVALUATED);
      });
      test('should call calculate totals function', () => {
        expect(calculateColumnTotals).toHaveBeenCalledWith(
          DEMO_DATA_EVALUATED,
          DEMO_NUMBER_COLUMNS
        );
      });
      test('should return totals data', () => {
        expect(renderedHook.current.totals).toEqual(DEMO_TOTALS);
      });
    });
    describe('managing value changes', () => {
      test('should merge update data but not re-sort or re-filter', () => {
        filterDataFuncInner.mockClear();
        sortTableData.mockClear();
        renderedHook.current.handleValueChange(...valueChangeArgsValues());
        expect(filterDataFuncInner).not.toHaveBeenCalled();
        expect(sortTableData).not.toHaveBeenCalled();
      });
      test('should merge update data and re evaluate cells and totals', () => {
        evaluateExpressionColumns.mockClear().mockReturnValue({ newData: 'evaluated' });
        calculateColumnTotals.mockClear().mockReturnValue({ newData: 'totals' });
        renderedHook.current.handleValueChange(...valueChangeArgsValues());
        expect(evaluateExpressionColumns).toHaveBeenCalledWith(DEMO_DATA_SORTED_MOD, DEMO_HEADINGS);
        expect(calculateColumnTotals).toHaveBeenCalledWith(
          { newData: 'evaluated' },
          DEMO_NUMBER_COLUMNS
        );
        expect(renderedHook.current.dataProcessed).toEqual({ newData: 'evaluated' });
      });
      test('should not switch unsaved changes hook on modify value', () => {
        expect(renderedHook.current.unsavedChanges).toEqual(false);
        renderedHook.current.handleValueChange(...valueChangeArgsValues());
        expect(renderedHook.current.unsavedChanges).toEqual(false);
      });
    });
    describe('Accepting value changes', () => {
      // This is the only bit that should be different for autosave
      test('should call autosave callback', () => {
        renderedHook.current.handleValueAccept(...valueChangeArgsValues());
        expect(mockAutoSaveCallback).toHaveBeenCalledWith(
          DEMO_DATA_MOD,
          SAVE_ACTIONS.ROW_CHANGED,
          DEMO_DATA_MOD[2],
          DEMO_DATA_MOD[2].uid,
          [valueChangeArgs().columnId]
        );
      });
      test('should not re-sort of re-filter', () => {
        filterDataFuncInner.mockClear();
        sortTableData.mockClear();
        renderedHook.current.handleValueAccept(...valueChangeArgsValues());
        expect(filterDataFuncInner).not.toHaveBeenCalled();
        expect(sortTableData).not.toHaveBeenCalled();
      });
      test('should not re evaluate cells and totals', () => {
        filterDataFuncInner.mockClear();
        sortTableData.mockClear();
        evaluateExpressionColumns.mockClear();
        calculateColumnTotals.mockClear();
        renderedHook.current.handleValueAccept(...valueChangeArgsValues());
        expect(evaluateExpressionColumns).not.toHaveBeenCalled();
        expect(calculateColumnTotals).not.toHaveBeenCalled();
        expect(renderedHook.current.dataProcessed).toEqual(DEMO_DATA_EVALUATED);
      });
      test('should not switch unsaved changes hook on modify value', () => {
        expect(renderedHook.current.unsavedChanges).toEqual(false);
        renderedHook.current.handleValueAccept(...valueChangeArgsValues());
        expect(renderedHook.current.unsavedChanges).toEqual(false);
      });
    });

    describe('Update a full row at once', () => {});

    describe('Adding a new row', () => {
      test('should call save fn with added row', () => {
        filterDataFuncInner.mockClear();
        renderedHook.current.handleAddRow();
        expect(generateNewRowData).toHaveBeenCalledWith(DEMO_HEADINGS);
        const newData = [...DEMO_DATA, DEMO_NEW_ROW_DATA];
        expect(mockAutoSaveCallback).toHaveBeenCalledWith(
          newData,
          SAVE_ACTIONS.ROW_ADDED,
          DEMO_NEW_ROW_DATA,
          DEMO_NEW_ROW_DATA.uid
        );
      });
    });

    describe('Deleting a row', () => {
      test('should call save fn with data minus row', () => {
        filterDataFuncInner.mockClear();
        renderedHook.current.handleDeleteRow(MOD_ROW_ID, MOD_INDEX);
        const dataCopy = DEMO_DATA.slice(0, ORIGINAL_DATA_ROW_MOD_INDEX).concat(
          DEMO_DATA.slice(ORIGINAL_DATA_ROW_MOD_INDEX + 1)
        );
        expect(mockAutoSaveCallback).toHaveBeenCalledWith(
          dataCopy,
          SAVE_ACTIONS.ROW_DELETED,
          null,
          MOD_ROW_ID
        );
      });
    });

    describe('Updating Input Data', () => {
      test.skip('should rerun sort and filter when external data changes', () => {
        filterDataFuncInner.mockClear();
        const modifiedProps = { ...defaultPropsAutosave };
        const modifiedData = [
          { uid: 1, description: 'hello' },
          { uid: 2, description: 'world' },
        ];
        modifiedProps[0] = modifiedData;
        rerenderHookFn(modifiedProps);
        expect(filterDataFuncInner).toHaveBeenCalledWith(DEMO_FILTERS_LIST, modifiedData);
        expect(renderedHook.current.dataUnProcessed).toEqual(modifiedData);
      });
    });
    describe('Returning totals data', () => {
      test('should calculate totals', () => {
        expect(evaluateExpressionColumns).toHaveBeenCalledWith(DEMO_DATA_SORTED, DEMO_HEADINGS);
      });
      test('should return totals', () => {
        expect(mockSaveTotalsCallback.mock.calls[0]).toEqual([{ count: 7 }]);
      });
    });
  });
});
