import { renderHook } from '@testing-library/react-hooks';
import useConditionalStylingManager from './ConditionalStylingManager';

const defaultProps = {
  // TODO: Allow per heading rules
  // headings: [
  //   {
  //     uid: 'name',
  //     label: 'Name',
  //     type: 'text',
  //     // styleRule: '$count>3',
  //   },
  //   {
  //     uid: 'count',
  //     label: 'Count',
  //     type: 'number',
  //     max: 10,
  //     min: 2,
  //     def: 8,
  //     showTotals: true,
  //   },
  // ],
  data: [
    { uid: 1, count: 99 },
    { uid: 2, count: 2 },
    { uid: 3, count: 1 },
  ],
  styleRule: '$count>3',
  styleOverride: { background: 'green' },
  rowErrors: [null, null, null],
};

const defaultPropsWithErrors = {
  ...defaultProps,
  styleRule: '',
  rowErrors: [{ type: 'DUPLICATE' }, [{ type: 'MISSING' }], null],
  errorStyleOverride: { DUPLICATE: { background: 'red' } },
};

describe('useConditionalStylingManager', () => {
  let renderedHook;
  describe('applying no rules', () => {
    beforeEach(() => {
      const { result } = renderHook((props) => useConditionalStylingManager(props), {
        initialProps: { ...defaultProps, styleRule: '' },
      });
      renderedHook = result;
    });
    test('should output array of empty objects', () => {
      const { rowStyles } = renderedHook.current;
      expect(rowStyles).toMatchSnapshot();
      expect(rowStyles.length).toEqual(defaultProps.data.length);
      expect(rowStyles).toEqual(defaultProps.data.map(() => ({})));
    });
  });
  describe('applying a simple format rule', () => {
    beforeEach(() => {
      const { result } = renderHook((props) => useConditionalStylingManager(props), {
        initialProps: defaultProps,
      });
      renderedHook = result;
    });
    test('should output rowStyles', () => {
      const { rowStyles } = renderedHook.current;
      expect(rowStyles).toMatchSnapshot();
    });
  });
  describe('Row Error Highlighting', () => {
    beforeEach(() => {
      const { result } = renderHook((props) => useConditionalStylingManager(props), {
        initialProps: defaultPropsWithErrors,
      });
      renderedHook = result;
    });

    test('should highlight rows with duplicate row error', () => {
      const { rowStyles } = renderedHook.current;
      expect(rowStyles).toMatchSnapshot();
      expect(rowStyles[0]).toEqual({
        background: 'red',
      });
    });

    test('should highlight rows with missing data row error', () => {
      const { rowStyles } = renderedHook.current;
      expect(rowStyles).toMatchSnapshot();
      expect(rowStyles[0]).toEqual({
        background: 'red',
      });
    });
  });
});
