import React from 'react';
import { screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@samnbuk/react_db_client.testing.utils';

import * as compositions from './cell.composition';

const changeColumnIndex = (target) => {
  const columnIndexSelection = screen.getByTestId('columnIndexSelection');
  fireEvent.change(columnIndexSelection, { target: { value: target.toString() } });
  // TODO: User event not working
  // userEvent.click(columnIndexSelection);
  // userEvent.type(columnIndexSelection, target);
};

test('should have compositions', () => {
  expect(Object.keys(compositions).length).toBeGreaterThan(0);
});
describe('Datatable Cell', () => {
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      if (name === 'default') return;
      describe(`${name} story`, () => {
        render(<Composition />);
      });
    });
  });
  describe('Display', () => {
    test('should show correct value', async () => {
      render(<compositions.ManagedCell />);
      changeColumnIndex(1);
      const cell = screen.getByRole('td');
      expect(cell).toBeInTheDocument();
      expect(cell.textContent).toEqual('Foo');
    });
  });
  describe('input', () => {
    test('should adjust the cell value', async () => {
      render(<compositions.ManagedCell />);
      changeColumnIndex(1);
      const cell = screen.getByRole('td');
      const cellNavigationWrap = within(cell).getByRole('navigation');
      await userEvent.click(cellNavigationWrap);
      const activeCell = await screen.findByTestId('activeCellWrap');
      expect(activeCell).toBeInTheDocument();
      const cellInput = within(activeCell).getByRole('textbox');
      expect(cellInput.value).toEqual('Foo');
      expect(cellInput).toHaveFocus();
      await userEvent.clear(cellInput);
      expect(cellInput.value).toEqual('');
      await userEvent.type(cellInput, 'Bar');
      expect(cellInput.value).toEqual('Bar');
      fireEvent.keyDown(cellInput, { key: 'Enter', code: 'Enter', charCode: 13 });
      expect(cell.textContent).toEqual('Bar');
    });
  });
});

// describe.only('testme', () => {
//   test('should clear input', async () => {
//     render(<input type="text" />);
//     const inp = screen.getByRole('textbox');
//     expect(inp.value).toEqual('');
//     await userEvent.type(inp, 'abc');
//     expect(inp.value).toEqual('abc');
//     inp.setSelectionRange(0, inp.value.length);
//     // await userEvent.type(inp, '{selectall}{backspace}');
//     await userEvent.clear(inp);
//     expect(inp.value).toEqual('');
//     await userEvent.type(inp, 'def');
//     expect(inp.value).toEqual('def');
//   });
// });
