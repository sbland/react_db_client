import { renderHook } from '@testing-library/react-hooks';
import useDataManager, { SAVE_ACTIONS } from './DataManager';
import {
  demoTableDataSimple,
  demoHeadingsDataSimple,
  demoFiltersData,
  demoTableDataEvaluatedSimple,
} from '../demoData';
import filterTypes from '../../../GenericConstants/filterTypes';
import { RowErrors } from '../errorTypes';

Date.now = jest.fn().mockImplementation(() => 0);

const DEMO_DATA = demoTableDataSimple;
// const DEMO_DATA_FILTERED = DEMO_DATA.slice(1);
const DEMO_HEADINGS = demoHeadingsDataSimple;
// const DEMO_FILTERS = demoFiltersData;
const DEMO_FILTERS_LIST = Object.values(demoFiltersData);
const DEMO_SORT_BY = { heading: 'count', direction: 1, map: null };
const DEMO_DATA_PROCESSED = demoTableDataEvaluatedSimple;
const DEMO_ROW_MOD = { ...DEMO_DATA_PROCESSED[0], count: 8, eval: 9 };
const DEMO_DATA_PROCESSED_MOD = Object.assign([], DEMO_DATA_PROCESSED, { 0: DEMO_ROW_MOD });
const DEMO_DATA_PROCESSED_MOD_SORTED = [...DEMO_DATA_PROCESSED_MOD].sort(
  (a, b) => a.count - b.count
);

const autoSaveCallback = jest.fn();

const defaultProps = {
  data: DEMO_DATA,
  headings: DEMO_HEADINGS,
  filters: DEMO_FILTERS_LIST,
  sortBy: DEMO_SORT_BY,
  calculateTotals: true,
  autoSave: false,
  autoSaveCallback,
};
const valueChangeArgs = Object.values({
  newVal: 8,
  rowId: DEMO_DATA_PROCESSED[0].uid,
  rowIndex: 0,
  columnId: 'count',
});

describe('useDataManager', () => {
  beforeEach(() => {
    autoSaveCallback.mockClear();
  });
  describe('Autosave off', () => {
    let renderedHook;
    beforeEach(() => {
      const { result } = renderHook(() => useDataManager(defaultProps));
      renderedHook = result;
    });
    describe('Process Data', () => {
      test('should return unprocessed data', () => {
        expect(renderedHook.current.dataUnProcessed).toEqual(DEMO_DATA);
      });
      test('should return processed data', () => {
        expect(renderedHook.current.dataProcessed).toEqual(DEMO_DATA_PROCESSED);
      });
      // test('should return totals data', () => {
      //   // expect(renderedHook.current.totals).toEqual(DEMO_TOTALS);
      // });
    });
    describe('Filtering data', () => {
      const { result } = renderHook(() => useDataManager(defaultProps));
      expect(result.current.dataProcessed).toEqual(DEMO_DATA_PROCESSED);
    });

    describe('managing value changes', () => {
      test('should merge update data and re evaluate cells and totals', () => {
        renderedHook.current.handleValueChange(...valueChangeArgs);
        expect(renderedHook.current.dataProcessed).toEqual(DEMO_DATA_PROCESSED_MOD);
      });
    });
    describe('Accepting value changes', () => {
      test('should merge update data and re evaluate cells and totals', async () => {
        renderedHook.current.handleValueAccept(...valueChangeArgs);
        // await waitForNextUpdate();
        expect(renderedHook.current.dataProcessed).toEqual(DEMO_DATA_PROCESSED_MOD_SORTED);
      });
    });

    describe('Update a full row at once', () => {});

    describe('Adding a new row', () => {});

    describe('Deleting a row', () => {});

    describe('Resetting data', () => {});
    describe('Unique Columns', () => {
      const data = [
        ...DEMO_DATA,
        {
          uid: 'z',
          label: 'ZED',
        },
      ];
      const props = {
        ...defaultProps,
        filters: [],
        sortBy: null,
        headings: [
          ...DEMO_HEADINGS.filter((h) => h.uid !== 'uid'),
          {
            uid: 'uid',
            label: 'UID',
            type: filterTypes.text,
            unique: true,
          },
        ],
        data,
      };
      describe('No duplicates', () => {
        test('should be able to set a heading to be unique', () => {
          const { result } = renderHook(() => useDataManager(props));
          expect(result.current.dataProcessed.map((d) => d.uid)).toEqual(data.map((d) => d.uid));
          const uniqueIds = new Set(result.current.dataProcessed.map((d) => d.uid));
          expect(uniqueIds.size).toEqual(result.current.dataProcessed.length);
        });
        test('should have no invalid rows', () => {
          const { result } = renderHook(() => useDataManager(props));
          expect(result.current.invalidRows).toEqual(data.map(() => false));
          expect(result.current.invalidRowsMessages).toEqual(data.map(() => null));
        });
      });
      describe('Has duplicated', () => {
        const dataMod = [...data, data[0]];
        const propsMod = {
          ...props,
          data: dataMod,
        };
        test('should be able to set a heading to be unique - added duplicate', () => {
          const { result } = renderHook(() => useDataManager(propsMod));
          expect(result.current.dataProcessed.map((d) => d.uid)).toEqual(dataMod.map((d) => d.uid));
          const uniqueIds = new Set(result.current.dataProcessed.map((d) => d.uid));
          expect(uniqueIds.size).toEqual(result.current.dataProcessed.length - 1);
        });
        test('should highlight rows that have duplicates', () => {
          const { result } = renderHook(() => useDataManager(propsMod));
          expect(result.current.invalidRows).toEqual(dataMod.map((d) => d.uid === data[0].uid));
          expect(result.current.invalidRowsMessages).toEqual(
            dataMod.map((d) =>
              d.uid === dataMod[0].uid ? { text: 'Duplicate UID', type: RowErrors.DUPLICATE } : null
            )
          );
        });
      });
      // Test that headings marked as unique have no duplicates
    });
    describe('Required Columns', () => {
      const data = DEMO_DATA;
      const props = {
        ...defaultProps,
        filters: [],
        sortBy: null,
        headings: [
          ...DEMO_HEADINGS.filter((h) => h.uid !== 'uid'),
          {
            uid: 'uid',
            label: 'UID',
            type: filterTypes.text,
            required: true,
          },
        ],
        data,
      };
      describe('All valid', () => {
        test('should be able to set a heading to be required', () => {
          const { result } = renderHook(() => useDataManager(props));
          expect(result.current.dataProcessed.map((d) => d.uid)).toEqual(data.map((d) => d.uid));
          const uniqueIds = new Set(result.current.dataProcessed.map((d) => d.uid));
          expect(uniqueIds.size).toEqual(result.current.dataProcessed.length);
        });
        test('should have no invalid rows', () => {
          const { result } = renderHook(() => useDataManager(props));
          expect(result.current.invalidRows).toEqual(data.map(() => false));
          expect(result.current.invalidRowsMessages).toEqual(data.map(() => null));
        });
      });
      describe('Missing required data', () => {
        const dataMod = [...data, { uid: null, label: 'Missing' }];
        const propsMod = {
          ...props,
          data: dataMod,
        };
        test('should highlight rows that have missing data', () => {
          const { result } = renderHook(() => useDataManager(propsMod));
          expect(result.current.invalidRows).toEqual(dataMod.map((d) => !d.uid));
          expect(result.current.invalidRowsMessages).toEqual(
            dataMod.map((d) => (!d.uid ? { text: 'Missing UID', type: RowErrors.MISSING } : null))
          );
        });
      });
    });
  });

  describe('Autosave on', () => {
    const props = { ...defaultProps, autoSave: true };
    let renderedHook;
    beforeEach(() => {
      const { result } = renderHook(() => useDataManager(props));
      renderedHook = result;
    });

    describe('managing value changes', () => {
      test('should not autosave when changing values', () => {
        renderedHook.current.handleValueChange(...valueChangeArgs);
        expect(autoSaveCallback).not.toHaveBeenCalled();
      });
    });
    describe('Accepting value changes', () => {
      test('should autosave when accepting values', async () => {
        const modifiedRow = DEMO_DATA.filter(
          (row) => row.uid === valueChangeArgs[1]
        ).map((row) => ({ ...row, [valueChangeArgs[3]]: valueChangeArgs[0] }))[0];
        const modifiedData = DEMO_DATA.map((row) =>
          row.uid === valueChangeArgs[1] ? modifiedRow : row
        );
        renderedHook.current.handleValueAccept(...valueChangeArgs);
        expect(autoSaveCallback).toHaveBeenCalledWith(
          modifiedData,
          SAVE_ACTIONS.ROW_CHANGED,
          modifiedRow,
          valueChangeArgs[1],
          [valueChangeArgs[3]]
        );
      });
    });
    describe('deleting row', () => {
      test('should autosave when deleting row', async () => {
        const modifiedData = DEMO_DATA.filter((row) => row.uid !== valueChangeArgs[1]);
        renderedHook.current.handleDeleteRow(...valueChangeArgs[1]);
        expect(autoSaveCallback).toHaveBeenCalledWith(
          modifiedData,
          SAVE_ACTIONS.ROW_DELETED,
          null,
          valueChangeArgs[1]
        );
      });
    });

    describe('Adding row', () => {
      test('should autosave when adding row', async () => {
        const newRowData = { uid: 'row_0', count: 7 };
        const modifiedData = [...DEMO_DATA, newRowData];
        renderedHook.current.handleAddRow();
        expect(autoSaveCallback).toHaveBeenCalledWith(
          modifiedData,
          SAVE_ACTIONS.ROW_ADDED,
          newRowData,
          newRowData.uid
        );
      });
    });
  });
  describe('Edge Cases', () => {
    describe('Modifying evaluated cells', () => {
      let renderedHook;
      const props = {
        data: DEMO_DATA,
        headings: [...DEMO_HEADINGS],
        filters: [],
        sortBy: {},
        calculateTotals: false,
        autoSave: false,
      };
      beforeEach(() => {
        const { result } = renderHook(() => useDataManager(props));
        renderedHook = result;
      });
      test('should return correct processed data initially', () => {
        expect(renderedHook.current.dataProcessed).toEqual(
          DEMO_DATA.map((d) => ({ ...d, eval: d.count + 1 }))
        );
      });
      test('should update evaluated cells when we update an input cell', () => {
        const newCount = 99;
        renderedHook.current.handleValueChange(newCount, DEMO_DATA[0].uid, 0, 'count');
        expect(renderedHook.current.dataProcessed[0]).toEqual({
          ...DEMO_DATA[0],
          count: newCount,
          eval: newCount + 1,
        });
      });
      test('should be able to update evaluated cell input', () => {
        const newEval = 99;
        const rowId = DEMO_DATA[0].uid;
        const columnId = 'eval';
        renderedHook.current.handleValueChange(newEval, rowId, 0, columnId);
        expect(renderedHook.current.dataProcessed[0]).toEqual({
          ...DEMO_DATA[0],
          count: newEval - 1,
          eval: newEval,
        });
      });
      test('should be able to update and accept evaluated cell input', () => {
        const newEval = 99;
        renderedHook.current.handleValueAccept(newEval, DEMO_DATA[0].uid, 0, 'eval');
        expect(renderedHook.current.dataProcessed.length).toEqual(5);
        expect(renderedHook.current.dataProcessed[0]).toEqual({
          ...DEMO_DATA[0],
          count: newEval - 1,
          eval: newEval,
        });
      });
    });
  });
});
