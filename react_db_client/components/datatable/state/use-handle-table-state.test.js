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

describe('useHandleTableState', () => {
  const defaultSetup = () => {
    return renderHook(() =>
      useHandleTableState({
        columns: demoHeadingsData,
        initialData: Object.values(DEMO_TABLE_DATA),
      })
    );
  };
  test('should init table data', () => {
    const { result } = defaultSetup();
    expect(result.current.tableState.tableData[0]).toEqual(DEMO_TABLE_DATA[0]);
  });

  describe('navigation', () => {
    test('initially be in navigation editMode', () => {
      const { result } = defaultSetup();
      expect(result.current.tableState.navigationMode).toEqual(true);
      expect(result.current.tableState.editMode).toEqual(false);
    });
    test('should have a focused cell', () => {
      const { result } = defaultSetup();
      expect(result.current.tableState.currentFocusedColumn).toEqual(0);
      expect(result.current.tableState.currentFocusedRow).toEqual(0);
    });
    describe('Navigation Simple', () => {
      test('should handle Left and Right arrow keys press', () => {
        const { result } = defaultSetup();
        act(() => {
          result.current.methods.onCellKeyPress(keyObject('ArrowRight'), 0, 0);
        });
        expect(result.current.tableState.currentFocusedColumn).toEqual(1);
        expect(result.current.tableState.currentFocusedRow).toEqual(0);
        act(() => {
          result.current.methods.onCellKeyPress(keyObject('ArrowLeft'), 0, 1);
        });
        expect(result.current.tableState.currentFocusedColumn).toEqual(0);
        expect(result.current.tableState.currentFocusedRow).toEqual(0);
      });
      test('should handle up and down arrow keys press', () => {
        const { result } = defaultSetup();
        act(() => {
          result.current.methods.onCellKeyPress(keyObject('ArrowDown'), 0, 0);
        });
        expect(result.current.tableState.currentFocusedColumn).toEqual(0);
        expect(result.current.tableState.currentFocusedRow).toEqual(1);
        act(() => {
          result.current.methods.onCellKeyPress(keyObject('ArrowUp'), 1, 0);
        });
        expect(result.current.tableState.currentFocusedColumn).toEqual(0);
        expect(result.current.tableState.currentFocusedRow).toEqual(0);
      });
    });
    describe('Navigation at edge', () => {
      test('Left from first column', () => {
        const { result } = defaultSetup();
        act(() => {
          result.current.methods.onCellKeyPress(keyObject('ArrowLeft'), 0, 0);
        });
        expect(result.current.tableState.currentFocusedColumn).toEqual(0);
        expect(result.current.tableState.currentFocusedRow).toEqual(0);
      });
      test('Right from last column', () => {
        const { result } = defaultSetup();
        const lastColumnIndex = demoHeadingsData.length - 1;
        act(() => {
          result.current.methods.onCellKeyPress(keyObject('ArrowRight'), 0, lastColumnIndex);
        });
        expect(result.current.tableState.currentFocusedColumn).toEqual(lastColumnIndex);
        expect(result.current.tableState.currentFocusedRow).toEqual(0);
      });
      test('Up from first row', () => {
        const { result } = defaultSetup();
        act(() => {
          result.current.methods.onCellKeyPress(keyObject('ArrowUp'), 0, 0);
        });
        expect(result.current.tableState.currentFocusedColumn).toEqual(0);
        expect(result.current.tableState.currentFocusedRow).toEqual(0);
      });
      test.skip('Down from last row - should create new row', () => {
        const { result } = defaultSetup();
        const lastRowIndex = DEMO_TABLE_DATA.length - 1;
        act(() => {
          result.current.methods.onCellKeyPress(keyObject('ArrowDown'), lastRowIndex, 0);
        });
        expect(result.current.tableState.currentFocusedColumn).toEqual(0);
        expect(result.current.tableState.currentFocusedRow).toEqual(lastRowIndex + 1);
        expect(result.current.tableState.tableData.length).toEqual(DEMO_TABLE_DATA.length + 1);
      });
    });

    describe('Navigation by select', () => {
      describe('From navigation mode', () => {
        test('On select should move focus', () => {
          // TODO: Implement Tests
        });
      });
      describe('From Edit Mode', () => {
        test('Should accept then handle select', () => {
          const { result } = defaultSetup();

          act(() => {
            result.current.methods.onCellAccept(null, 0, 0);
            result.current.methods.onCellSelect(null, 1, 0);
          });
          expect(result.current.tableState.currentFocusedColumn).toEqual(0);
          expect(result.current.tableState.currentFocusedRow).toEqual(1);
          // TODO: Why is this failing!
          expect(result.current.tableState.navigationMode).toEqual(false);
          expect(result.current.tableState.editMode).toEqual(true);
        });
      });
    });
  });
});
