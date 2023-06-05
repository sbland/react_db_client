import React from 'react';
import { screen, render, within, waitFor } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import * as compositions from '../datatable-legacy.composition';
import { demoTableDataEvaluationTable, evaluationTableHeadings } from '../demoData';

describe('SearchAndSelect', () => {
  describe('Compositions', () => {
    Object.entries(compositions as unknown as React.FC<{}> & { forTests?: boolean })
      .filter(([name, Composition]) => (Composition as any).forTests)
      .forEach(([name, Composition]) => {
        test(name, async () => {
          render(<Composition />);
          // @ts-ignore
          if (Composition.waitForReady) await Composition.waitForReady();
        });
      });
  });
  describe('Unit Tests', () => {
    describe('Displaying row data', () => {});
  });
  describe('Functional Tests', () => {
    test('should evaluate expressions', async () => {
      render(<compositions.CalculatedDataTableWrapper />);
      const dataTable = screen.getByTestId('dataTable');
      const rowCount = within(dataTable).getAllByTestId('cell_1_', { exact: false }).length;
      expect(rowCount).toEqual(demoTableDataEvaluationTable.length);
      expect(evaluationTableHeadings[1].uid).toEqual('a');
      const cell_2_0 = within(dataTable).getByTestId('cell_2_0_', { exact: false });
      expect(cell_2_0).toHaveTextContent('1'); // a = 1
      expect(evaluationTableHeadings[2].uid).toEqual('b');
      const cell_3_0 = within(dataTable).getByTestId('cell_3_0_', { exact: false });
      expect(cell_3_0).toHaveTextContent('1'); // b = 1
      expect(evaluationTableHeadings[3].uid).toEqual('c');
      expect(evaluationTableHeadings[3].expression).toEqual('$a + $b');
      const cell_4_0 = within(dataTable).getByTestId('cell_4_0_', { exact: false });
      expect(cell_4_0).toHaveTextContent('2'); // c = a + b = 1 + 1 = 2
    });
    test('should modify cell C0 if cell A0 is changed', async () => {
      render(<compositions.CalculatedDataTableWrapper />);
      const dataTable = screen.getByTestId('dataTable');
      const cell_2_0 = within(dataTable).getByTestId('cell_2_0_', { exact: false });
      const cell_3_0 = within(dataTable).getByTestId('cell_3_0_', { exact: false });
      const cell_4_0 = within(dataTable).getByTestId('cell_4_0_', { exact: false });
      await waitFor(() => expect(cell_2_0).toHaveTextContent('1'));
      await UserEvent.click(cell_2_0);
      const input = within(cell_2_0).getByRole('spinbutton');
      await UserEvent.click(input);
      await UserEvent.clear(input);
      await UserEvent.keyboard('2');
      await UserEvent.tab();
      await UserEvent.click(dataTable); // Move focus away from cell_2_0
      await waitFor(() => expect(cell_2_0).not.toHaveFocus());
      expect(cell_2_0).toHaveTextContent('2'); // a = 2
      expect(cell_3_0).toHaveTextContent('1'); // b = 1
      expect(cell_4_0).toHaveTextContent('3'); // c = a + b = 2 + 1 = 3
    });
    test.todo('should save correct table data when using autosave and changing cell A0');
  });
});
