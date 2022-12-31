import React from 'react';
import { screen, render, within } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';

import * as compositions from './column-manager.composition';

describe('Column Manager', () => {
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, async () => {
        render(<Composition />);
        // @ts-ignore
        if (Composition.waitForReady) await Composition.waitForReady();
      });
    });
  });
  test.todo('should update table width if input columns changes');
  // test('should update table width if input columns changes', async () => {
  // const { result, rerender } = renderHook(
  //   (props) => useColumnManager(props),
  //   {
  //     initialProps: defaultProps,
  //   }
  // );
  // const newHeadingsData = DEMO_HEADINGS.slice(1);
  // expect(result.current.columnWidths.length).toEqual(18);
  // expect(result.current.tableWidth).toEqual(1927);
  // rerender({ ...defaultProps, headingsDataList: newHeadingsData });
  // expect(result.current.columnWidths.length).toEqual(17);
  // expect(result.current.tableWidth).toEqual(1886);

  // });
});
