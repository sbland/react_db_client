import { renderHook, act } from '@testing-library/react-hooks';
import {
  demoTableData,
  demoHeadingsData,
} from '@samnbuk/react_db_client.components.datatable.extras';
import { useHandleTableState } from './use-handle-table-state';

const DEMO_TABLE_DATA = Array(3)
  .fill(0)
  .reduce((acc, _) => [...acc, ...Object.values(demoTableData)], []);

const keyObject = (key) => ({ key, preventDefault: () => {} });
const headingsDataDict = demoHeadingsData.reduce((acc, v) => ({ ...acc, [v.uid]: v }));

describe('useHandleTableState', () => {
  const defaultSetup = () =>
    renderHook(() =>
      useHandleTableState({
        columns: demoHeadingsData,
        initialData: DEMO_TABLE_DATA,
      })
    );
  describe('Providing Table Data', () => {
    test('should init table data', () => {
      const { result } = defaultSetup();
      expect(result.current.tableData[0]).toEqual(DEMO_TABLE_DATA[0]);
    });
    test('should update table data if external table data updates', () => {
      let initialDataInner = [...DEMO_TABLE_DATA];
      const { result, rerender } = renderHook(() =>
        useHandleTableState({
          columns: demoHeadingsData,
          initialData: initialDataInner,
        })
      );
      expect(result.current.tableData.length).toEqual(initialDataInner.length);

      initialDataInner = [...initialDataInner, initialDataInner[1]];
      rerender();
      expect(result.current.tableData.length).toEqual(initialDataInner.length);
    });
  });

  describe('Initial State', () => {
    test('initially be in navigation editMode', () => {
      const { result } = defaultSetup();
      expect(result.current.navigationMode).toEqual(true);
      expect(result.current.editMode).toEqual(false);
    });
    test('should have a focused cell', () => {
      const { result } = defaultSetup();
      expect(result.current.currentFocusedColumn).toEqual(0);
      expect(result.current.currentFocusedRow).toEqual(0);
    });
  });
  describe('navigation', () => {
    describe('Navigation Simple', () => {
      test('should handle Left and Right arrow keys press', () => {
        const { result } = defaultSetup();
        act(() => {
          result.current.onCellKeyPress(keyObject('ArrowRight'), 0, 0);
        });
        expect(result.current.currentFocusedColumn).toEqual(1);
        expect(result.current.currentFocusedRow).toEqual(0);
        act(() => {
          result.current.onCellKeyPress(keyObject('ArrowLeft'), 0, 1);
        });
        expect(result.current.currentFocusedColumn).toEqual(0);
        expect(result.current.currentFocusedRow).toEqual(0);
      });
      test('should handle up and down arrow keys press', () => {
        const { result } = defaultSetup();
        act(() => {
          result.current.onCellKeyPress(keyObject('ArrowDown'), 0, 0);
        });
        expect(result.current.currentFocusedColumn).toEqual(0);
        expect(result.current.currentFocusedRow).toEqual(1);
        act(() => {
          result.current.onCellKeyPress(keyObject('ArrowUp'), 1, 0);
        });
        expect(result.current.currentFocusedColumn).toEqual(0);
        expect(result.current.currentFocusedRow).toEqual(0);
      });
    });
    describe('Navigation at edge', () => {
      test('Left from first column', () => {
        const { result } = defaultSetup();
        act(() => {
          result.current.onCellKeyPress(keyObject('ArrowLeft'), 0, 0);
        });
        expect(result.current.currentFocusedColumn).toEqual(0);
        expect(result.current.currentFocusedRow).toEqual(0);
      });
      test('Right from last column', () => {
        const { result } = defaultSetup();
        const lastColumnIndex = demoHeadingsData.length - 1;
        act(() => {
          result.current.onCellKeyPress(keyObject('ArrowRight'), 0, lastColumnIndex);
        });
        expect(result.current.currentFocusedColumn).toEqual(lastColumnIndex);
        expect(result.current.currentFocusedRow).toEqual(0);
      });
      test('Up from first row', () => {
        const { result } = defaultSetup();
        act(() => {
          result.current.onCellKeyPress(keyObject('ArrowUp'), 0, 0);
        });
        expect(result.current.currentFocusedColumn).toEqual(0);
        expect(result.current.currentFocusedRow).toEqual(0);
      });
      test('Down from last row', () => {
        const { result } = defaultSetup();
        const lastRowIndex = DEMO_TABLE_DATA.length - 1;
        act(() => {
          result.current.onCellKeyPress(keyObject('ArrowDown'), lastRowIndex, 0);
        });
        expect(result.current.currentFocusedColumn).toEqual(0);
        expect(result.current.currentFocusedRow).toEqual(lastRowIndex);
      });
    });

    describe('Navigation by select', () => {
      describe('From navigation mode', () => {
        test('On select should move focus', () => {
          // TODO: Implement Tests
        });
      });
      describe('From Edit Mode', () => {
        test.skip('Should accept then handle select', () => {
          const { result } = defaultSetup();

          act(() => {
            result.current.onCellAccept(null, 0, 0);
            result.current.onCellSelect(null, 1, 0);
          });
          expect(result.current.currentFocusedColumn).toEqual(0);
          expect(result.current.currentFocusedRow).toEqual(1);
          // TODO: Why is this failing!
          expect(result.current.navigationMode).toEqual(false);
          expect(result.current.editMode).toEqual(true);
        });
      });
    });
  });
  describe('Adding new row', () => {
    test('Down from last row - should create new row', () => {
      const { result } = defaultSetup();
      const lastRowIndex = DEMO_TABLE_DATA.length - 1;
      act(() => {
        result.current.onCellKeyPress(keyObject('ArrowDown'), lastRowIndex, 0);
      });
      expect(result.current.currentFocusedColumn).toEqual(0);
      expect(result.current.tableData.length).toEqual(DEMO_TABLE_DATA.length + 1);
      // Pressing again will now move to last row
      act(() => {
        result.current.onCellKeyPress(keyObject('ArrowDown'), lastRowIndex, 0);
      });
      expect(result.current.currentFocusedColumn).toEqual(0);
      expect(result.current.tableData.length).toEqual(DEMO_TABLE_DATA.length + 1);
    });
    test('should add new row', () => {
      const { result } = defaultSetup();
      act(() => {
        result.current.addNewRow();
      });
      expect(result.current.currentFocusedColumn).toEqual(0);
      expect(result.current.tableData.length).toEqual(DEMO_TABLE_DATA.length + 1);
    });
    test('should add new row with column defaults', () => {
      const { result } = defaultSetup();
      act(() => {
        result.current.addNewRow();
      });
      const lastRowIndex = DEMO_TABLE_DATA.length - 1;
      expect(result.current.tableData[lastRowIndex + 1].def).toEqual(
        headingsDataDict.def.defaultValue
      );
    });
  });
});
