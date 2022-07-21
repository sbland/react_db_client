import React from 'react';
import { screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@samnbuk/react_db_client.testing.utils';
import {
  DEMO_TABLE_DATA,
  DEMO_TABLE_DATA_LARGE,
} from '@samnbuk/react_db_client.components.datatable.extras';

import * as compositions from './datatable.composition';

const { StressTest, DatatableForTests } = compositions;

jest.mock(
  'react-virtualized-auto-sizer',
  () =>
    ({ children }) =>
      children({ height: 600, width: 600 })
);

const getCellByLoc = (rowI, colI) => {
  const rows = screen.getAllByRole('tr');
  const row = rows[rowI];
  const cells = within(row).getAllByRole('td');
  const cell = cells[colI];
  return cell;
};

const getNavigationElForCell = (rowI, colI) => {
  const cellTopLeft = getCellByLoc(rowI, colI);
  const navigationCell = within(cellTopLeft).getByRole('navigation');
  return navigationCell;
};

const focusOnCell = (rowI, colI) => {
  const navigationCell = getNavigationElForCell(rowI, colI);
  // TODO: Shouldn't need to focus on first cell here.
  navigationCell.focus();
  return navigationCell;
};

const clickOnCell = async (rowI, colI) => {
  const firstCell = getCellByLoc(rowI, colI);
  const firstCellNavigation = within(firstCell).getByRole('navigation', {
    name: /navigation/i,
  });
  await userEvent.click(firstCellNavigation);
  const activeCellWrap = await screen.findByTestId('activeCellWrap');
  return activeCellWrap;
};

const pressEnterOnCell = async (rowI, colI) => {
  const navigationCell = focusOnCell(rowI, colI);
  await userEvent.type(navigationCell, '{enter}');
  const activeCellWrap = await screen.findByTestId('activeCellWrap');
  return activeCellWrap;
};

// function allDescendants(node) {
//   let descendants = [];
//   const children = Array.from(node.children);
//   for (var i = 0; i < children.length; i++) {
//     var child = children[i];
//     descendants = [...descendants, ...allDescendants(child)];
//   }
//   return descendants;
// }

// const getVisibleTextContent = (el) => {
//   const childElements = allDescendants(el);
//   // console.log(childElements.length);
//   const visibleTextContent = childElements.map((c) => c.textContent);
//   return visibleTextContent;
// };

// const isVisible = (elem) => {
//   console.log(elem.offsetWidth);
//   return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
// };

// const demo = (node, match, options = {}) => {
//   const { hidden } = options;
//   // if (!hidden && node.offsetParent === null) return [];
//   if (!hidden && !isVisible(node)) return [];
//   if (node.textContent === '') return '';
//   if (node.textContent === match) return [node];
//   console.log(node.textContent);
//   const childrenDontHaveText = Array.from(node.children).map((child) =>
//     child.textContent ? demo(child, match) : ''
//   );
//   console.log(childrenDontHaveText);
//   return childrenDontHaveText.flat();
// };

describe('Datatable', () => {
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      if (name === 'default') return;
      test(`${name} story`, () => {
        render(<Composition />);
      });
    });
  });
  describe('DatatableForTests', () => {
    beforeEach(() => {
      render(<DatatableForTests />);
    });
    test('should render without errors', () => {});
    describe('Initial State', () => {
      test('should render first few rows of cells', () => {
        const rows = screen.getAllByRole('tr');
        expect(rows[0]).toBeInTheDocument();
        expect(rows.length).toBeGreaterThan(0);
        expect(rows.length).toEqual(DEMO_TABLE_DATA.length);
      });
      test('should render first cell', () => {
        const firstCellNavigation = focusOnCell(0, 0);
        expect(firstCellNavigation).toBeVisible();
        expect(firstCellNavigation).toHaveFocus();
      });
    });
    describe('Navigation', () => {
      test.skip('should focus on the top left cell initially', () => {
        const cells = screen.getAllByRole('td');
        const firstCell = cells.find((c) => within(c).queryAllByText('a0'));
        const navigationCell = within(firstCell).getByRole('navigation');
        // TODO: Shouldn't need to focus on first cell here.
        expect(navigationCell).toBeVisible();
        expect(navigationCell).toHaveFocus();
      });
      test('Should be able to navigate around the table with the arrow keys', () => {
        let nextCellNavigation;
        const firstCellNavigation = focusOnCell(0, 0);

        fireEvent.keyDown(firstCellNavigation, { key: 'ArrowRight' });
        nextCellNavigation = getNavigationElForCell(0, 1);
        expect(nextCellNavigation).toHaveFocus();
        fireEvent.keyDown(nextCellNavigation, { key: 'ArrowDown' });
        nextCellNavigation = getNavigationElForCell(1, 1);
        expect(nextCellNavigation).toHaveFocus();
        fireEvent.keyDown(nextCellNavigation, { key: 'ArrowLeft' });
        nextCellNavigation = getNavigationElForCell(1, 0);
        expect(nextCellNavigation).toHaveFocus();
        fireEvent.keyDown(nextCellNavigation, { key: 'ArrowUp' });
        nextCellNavigation = getNavigationElForCell(0, 0);
        expect(nextCellNavigation).toHaveFocus();
      });
      test('should add new row when pressing ArrowDown from last row', () => {
        const bottomRowCell = focusOnCell(9, 0);
        fireEvent.keyDown(bottomRowCell, { key: 'ArrowDown' });
        expect(bottomRowCell).toHaveFocus();
      });
      test.todo('should return to navigation mode after exiting edit mode');
    });
    describe('Editing cells', () => {
      test('should display value of cell', async () => {
        const firstCell = getCellByLoc(0, 0);
        expect(firstCell.textContent).toEqual('a0');
      });
      test('should allow focusing on editable cell with click', async () => {
        expect(screen.queryByTestId('activeCellWrap')).not.toBeInTheDocument();
        const activeCellWrap = await clickOnCell(0, 0);
        expect(activeCellWrap).toBeVisible();
        const cellInput = within(activeCellWrap).getByRole('textbox');
        expect(cellInput).toHaveFocus();
        expect(cellInput.value).toEqual('a0');
      });
      test('Should modify a cell contents when clicking on the cell and typing', async () => {
        const activeCellWrap = await clickOnCell(0, 0);
        const cellInput = within(activeCellWrap).getByRole('textbox');
        await userEvent.clear(cellInput);
        expect(cellInput.value).toEqual('');
        await userEvent.type(cellInput, 'hello');
        expect(cellInput.value).toEqual('hello');
      });
      test('Should modify a cell contents when pressing enter when focused on the cell and typing', async () => {
        const activeCellWrap = await pressEnterOnCell(0, 0);
        const cellInput = within(activeCellWrap).getByRole('textbox');
        await userEvent.clear(cellInput);
        expect(cellInput.value).toEqual('');
        await userEvent.type(cellInput, 'hello');
        expect(cellInput.value).toEqual('hello');
      });
      test('should exit edit mode when pressing the enter key', async () => {
        const activeCellWrap = await pressEnterOnCell(0, 0);
        const cellInput = within(activeCellWrap).getByRole('textbox');
        await userEvent.type(cellInput, '{enter}');
        expect(screen.queryByTestId('activeCellWrap')).not.toBeInTheDocument();
        const firstCell = getCellByLoc(0, 0);
        expect(firstCell.textContent).toEqual('a0');
      });
      test('Should accept changes when pressing enter during edit mode', async () => {
        const activeCellWrap = await pressEnterOnCell(0, 0);
        const cellInput = within(activeCellWrap).getByRole('textbox');
        await userEvent.clear(cellInput);
        expect(cellInput.value).toEqual('');
        await userEvent.type(cellInput, 'hello');
        expect(cellInput.value).toEqual('hello');
        await userEvent.type(cellInput, '{enter}');
        expect(screen.queryByTestId('activeCellWrap')).not.toBeInTheDocument();
        const firstCell = getCellByLoc(0, 0);
        expect(firstCell.textContent).toEqual('hello');
      });
      test('Should cancel editing a cell when pressing escape key during edit mode', async () => {
        const activeCellWrap = await pressEnterOnCell(0, 0);
        const cellInput = within(activeCellWrap).getByRole('textbox');
        await userEvent.clear(cellInput);
        expect(cellInput.value).toEqual('');
        await userEvent.type(cellInput, 'hello');
        expect(cellInput.value).toEqual('hello');
        await userEvent.type(cellInput, '{escape}');
        expect(screen.queryByTestId('activeCellWrap')).not.toBeInTheDocument();
        const firstCell = getCellByLoc(0, 0);
        expect(firstCell.textContent).toEqual('a0');
      });
    });
    describe('External state changes - saving out', () => {
      test.todo('Should save the changes to parent on change');
    });
  });

  describe.skip('Stress test Datatable', () => {
    beforeEach(() => {
      render(<StressTest />);
    });
    test('should render without errors', () => {});
    describe('Initial State', () => {
      test('should render first few rows of cells', () => {
        const rows = screen.getAllByRole('tr');
        expect(rows.length).toBeGreaterThan(0);
        expect(rows.length).toBeLessThan(DEMO_TABLE_DATA_LARGE.length);
      });
    });
  });
});
