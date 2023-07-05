import { screen, within } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';

type QueryType = ReturnType<typeof within>;

export const clickToggleBtn = async (btnName: string) => {
  const btn = screen.getByRole('button', { name: btnName });
  await UserEvent.click(btn);
};

export const openFilterPanel = async (elQuery: QueryType) => {
  const filterBtn = elQuery.getByRole('button', { name: 'Filters' });
  await UserEvent.click(filterBtn);
  const filterPanel = await elQuery.findByTestId('rdc-filterManager');
  return filterPanel;
};

export const addFilter = async (elQuery: QueryType) => {
  const addFilterBtn = elQuery.getByRole('button', { name: 'Add Filter' });
  await UserEvent.click(addFilterBtn);
  const filtersList = await elQuery.findByRole('list');
  const filterItems = await within(filtersList).findAllByRole('listitem');
  expect(filterItems.length).toBeGreaterThan(0);
  return filterItems[filterItems.length - 1];
};

export const getCellContent = (dataTable: HTMLElement, rowIndex: number, columnId: string) => {
  const columnCells = within(dataTable).getAllByTestId(`cell_${columnId}`, {
    exact: false,
  });
  const textCell = columnCells[rowIndex];
  return textCell.textContent;
};
export const getCellValue = (dataTable: HTMLElement, rowIndex: number, columnId: string) => {
  const columnCells = within(dataTable).getAllByTestId(`cell_${columnId}`, {
    exact: false,
  });
  const cell = columnCells[rowIndex];
  const value = (within(cell).getByRole('spinbutton') as HTMLInputElement).value;
  return value;
};

export const editCell = async (
  dataTable: HTMLElement,
  rowIndex: number,
  columnId: string,
  newValue: string,
  inputRole: 'textbox' | 'combobox' | 'spinbutton' = 'textbox',
  acceptValue: boolean = true
) => {
  const columnCells = within(dataTable).getAllByTestId(`cell_${columnId}_`, {
    exact: false,
  });
  const textCell = columnCells[rowIndex];
  await UserEvent.click(textCell);
  const textCellInput = within(textCell).getByRole(inputRole);
  await UserEvent.clear(textCellInput);
  await UserEvent.type(textCellInput, newValue);
  if (acceptValue) await UserEvent.click(dataTable);
};