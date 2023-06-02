import React from 'react';
import { screen, render, within, waitFor } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import {
  comparisonMetaData,
  EComparisons,
  EFilterType,
  Uid,
} from '@react_db_client/constants.client-types';
import * as compositions from './datatable-legacy.composition';
import {
  demoHeadingsData,
  demoTableData,
  generateDemoTableDataFilteredByColumns,
  headingExampleNumber,
  headingExampleText,
} from './demoData';
import { saveData } from './test-utils/mock-api';
import { SAVE_ACTIONS } from './DataManager';
import { IHeadingCustomExample, IHeadingNumber, THeading } from './lib';

jest.mock('./test-utils/mock-api');

type QueryType = ReturnType<typeof within>;

const demoHeadingsDataObj: { [k: Uid]: THeading<IHeadingCustomExample> } = demoHeadingsData.reduce(
  (acc, h) => ({ ...acc, [h.uid]: h }),
  {}
);

const clickToggleBtn = async (btnName: string) => {
  const btn = screen.getByRole('button', { name: btnName });
  await UserEvent.click(btn);
};

const resetDataBtn = async () => {
  const autosaveBtn = screen.getByRole('button', { name: 'Reset data' });
  await UserEvent.click(autosaveBtn);
};

const openFilterPanel = async (elQuery: QueryType) => {
  const filterBtn = elQuery.getByRole('button', { name: 'Filters' });
  await UserEvent.click(filterBtn);
  const filterPanel = await elQuery.findByTestId('rdc-filterManger');
  return filterPanel;
};

const addFilter = async (elQuery: QueryType) => {
  const addFilterBtn = elQuery.getByRole('button', { name: 'Add Filter' });
  await UserEvent.click(addFilterBtn);
  const filtersList = await elQuery.findByRole('list');
  const filterItems = await within(filtersList).findAllByRole('listitem');
  expect(filterItems.length).toBeGreaterThan(0);
  return filterItems[filterItems.length - 1];
};

const getCellContent = (dataTable: HTMLElement, rowIndex: number, columnId: string) => {
  const columnCells = within(dataTable).getAllByTestId(`cell_${columnId}`, {
    exact: false,
  });
  const textCell = columnCells[rowIndex];
  return textCell.textContent;
};

const editCell = async (
  dataTable: HTMLElement,
  rowIndex: number,
  columnId: string,
  newValue: string,
  inputRole: 'textbox' | 'combobox' | 'spinbutton' = 'textbox',
  acceptValue: boolean = true
) => {
  const columnCells = within(dataTable).getAllByTestId(`cell_${columnId}`, {
    exact: false,
  });
  const textCell = columnCells[rowIndex];
  await UserEvent.click(textCell);
  const textCellInput = within(textCell).getByRole(inputRole);
  await UserEvent.clear(textCellInput);
  await UserEvent.type(textCellInput, newValue);
  if (acceptValue) await UserEvent.click(dataTable);
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Data Table', () => {
  describe('Compositions', () => {
    Object.entries(compositions as unknown as React.FC<{}> & { forTests?: boolean })
      .filter(([name, Composition]) => Composition.forTests)
      .forEach(([name, Composition]) => {
        test(name, async () => {
          render(<Composition />);
          // @ts-ignore
          if (Composition.waitForReady) await Composition.waitForReady();
        });
      });
  });
  describe('Unit Tests', () => {
    describe('Displaying row data', () => {
      test("should display each row's data", () => {
        render(<compositions.BasicDataTableWrapper />);
        const dataTable = screen.getByTestId('dataTable');
        const rowCount = within(dataTable).getAllByTestId('cell_1_', { exact: false }).length;
        expect(rowCount).toEqual(demoTableData.length);
      });
    });
  });
  describe('Functional Tests', () => {
    describe('deleting rows', () => {
      test.todo('should delete a row from the data when we click the delete btn');
    });
    describe('Saving', () => {
      test.each`
        newCellValue | columnId   | rowIndex | inputRole       | headings                  | columnFilter
        ${'abc'}     | ${'name'}  | ${0}     | ${'textbox'}    | ${[headingExampleText]}   | ${'Text Column Only'}
        ${9}         | ${'count'} | ${0}     | ${'spinbutton'} | ${[headingExampleNumber]} | ${'Number Column Only'}
      `(
        'should call saveData with new data $columnId',
        async ({ newCellValue, columnId, rowIndex, inputRole, headings, columnFilter }) => {
          render(<compositions.DataTableWrapperForTests />);
          await clickToggleBtn(columnFilter);
          await clickToggleBtn('Generate 1 row');
          const tableData = generateDemoTableDataFilteredByColumns(1, headings);
          const dataTable = screen.getByTestId('dataTable');
          expect(getCellContent(dataTable, rowIndex, columnId)).toEqual(
            String(tableData[rowIndex][columnId])
          );
          await editCell(dataTable, rowIndex, columnId, String(newCellValue), inputRole);
          expect(getCellContent(dataTable, rowIndex, columnId)).toEqual(String(newCellValue));
          const saveBtn = screen.getByRole('button', { name: 'Save' });
          await UserEvent.click(saveBtn);
          const newRowData = {
            ...tableData[rowIndex],
            [columnId]: String(newCellValue),
          };
          expect(saveData).toHaveBeenCalledTimes(1);
          expect(saveData).toHaveBeenCalledWith(
            [newRowData, ...tableData.slice(1)],
            SAVE_ACTIONS.SAVE_BTN_CLICKED
          );
        }
      );

      test('should call saveData with validated number data when number field has max property', async () => {
        render(<compositions.BasicDataTableWrapper />);
        const dataTable = screen.getByTestId('dataTable');
        const heading: IHeadingNumber = demoHeadingsDataObj.count as IHeadingNumber;
        const newCellValue = (heading.max as number) + 10;
        const columnId = 'count';
        const rowIndex = 0;
        expect(getCellContent(dataTable, rowIndex, columnId)).toEqual(
          String(demoTableData[rowIndex][columnId])
        );
        await editCell(dataTable, rowIndex, columnId, String(newCellValue), 'spinbutton');
        const saveBtn = screen.getByRole('button', { name: 'Save' });
        await UserEvent.click(saveBtn);

        const newRowData = {
          ...demoTableData[rowIndex],
          [columnId]: demoTableData[rowIndex][columnId],
        };
        expect(saveData).toHaveBeenCalledTimes(1);
        expect(saveData).toHaveBeenCalledWith(
          [newRowData, ...demoTableData.slice(1)],
          SAVE_ACTIONS.SAVE_BTN_CLICKED
        );
      });
      test('should call saveData with new data from multiple rows', async () => {
        render(<compositions.BasicDataTableWrapper />);
        const dataTable = screen.getByTestId('dataTable');
        const newCellValue = 'abc';
        const columnId = 'name';
        await editCell(dataTable, 0, columnId, newCellValue);
        await editCell(dataTable, 1, columnId, newCellValue);
        const saveBtn = screen.getByRole('button', { name: 'Save' });
        await UserEvent.click(saveBtn);

        const newRowData0 = {
          ...demoTableData[0],
          name: newCellValue,
        };
        const newRowData1 = {
          ...demoTableData[1],
          name: newCellValue,
        };
        expect(saveData).toHaveBeenCalledTimes(1);
        expect(saveData).toHaveBeenCalledWith(
          [newRowData0, newRowData1, ...demoTableData.slice(2)],
          SAVE_ACTIONS.SAVE_BTN_CLICKED
        );
      });
    });

    describe('Managed component', () => {
      test.todo(
        'If datatable is a managed component then it should not store data changes but instead pass them up the chain'
      );
      test.each`
        newCellValue | columnId   | rowIndex | inputRole       | headings                  | columnFilter
        ${'abc'}     | ${'name'}  | ${0}     | ${'textbox'}    | ${[headingExampleText]}   | ${'Text Column Only'}
        ${9}         | ${'count'} | ${0}     | ${'spinbutton'} | ${[headingExampleNumber]} | ${'Number Column Only'}
      `(
        'should update $columnId field when external data changes',
        async ({ newCellValue, columnId, rowIndex, inputRole, headings, columnFilter }) => {
          render(<compositions.DataTableWrapperForTests />);
          await clickToggleBtn(columnFilter);
          await clickToggleBtn('Generate 1 row');
          await clickToggleBtn('Toggle managed');
          await clickToggleBtn('Toggle autosave');
          const tableData = generateDemoTableDataFilteredByColumns(1, headings);
          const dataTable = screen.getByTestId('dataTable');
          expect(getCellContent(dataTable, rowIndex, columnId)).toEqual(
            String(tableData[rowIndex][columnId])
          );
          await editCell(dataTable, rowIndex, columnId, String(newCellValue), inputRole);
          expect(getCellContent(dataTable, rowIndex, columnId)).toEqual(String(newCellValue));
          await resetDataBtn();
          expect(getCellContent(dataTable, rowIndex, columnId)).toEqual(
            String(tableData[rowIndex][columnId])
          );
        }
      );
    });

    describe('Autosaving', () => {
      test('should call saveData with new data after making changes', async () => {
        render(<compositions.BasicDataTableWrapper />);
        const autosaveBtn = screen.getByRole('button', { name: 'Toggle autosave' });
        await UserEvent.click(autosaveBtn);
        const dataTable = screen.getByTestId('dataTable');
        const newCellValue = 'abc';
        const columnId = 'name';
        const rowIndex = 0;
        await editCell(dataTable, rowIndex, columnId, newCellValue);

        const newRowData = {
          ...demoTableData[0],
          name: newCellValue,
        };
        expect(saveData).toHaveBeenCalledTimes(1);
        expect(saveData).toHaveBeenCalledWith(
          [newRowData, ...demoTableData.slice(1)],
          SAVE_ACTIONS.ROW_CHANGED,
          newRowData,
          newRowData.uid,
          [columnId]
        );
        /* Assert input data not modified */
        expect(demoTableData[0].name).not.toEqual(newCellValue);
      });
      test('should call saveData with new data using limited number cell', async () => {
        render(<compositions.BasicDataTableWrapper />);
        const autosaveBtn = screen.getByRole('button', { name: 'Toggle autosave' });
        await UserEvent.click(autosaveBtn);
        const dataTable = screen.getByTestId('dataTable');
        const heading: IHeadingNumber = demoHeadingsDataObj.count as IHeadingNumber;
        const newCellValue = (heading.max as number) + 10;
        const columnId = 'count';
        const rowIndex = 0;
        expect(getCellContent(dataTable, rowIndex, columnId)).toEqual(
          String(demoTableData[rowIndex][columnId])
        );
        await editCell(dataTable, rowIndex, columnId, String(newCellValue), 'spinbutton');

        const newRowData = {
          ...demoTableData[rowIndex],
          // [columnId]: heading.max,
        };
        expect(saveData).toHaveBeenCalledTimes(1);
        expect(saveData).toHaveBeenCalledWith(
          [newRowData, ...demoTableData.slice(1)],
          SAVE_ACTIONS.ROW_CHANGED,
          newRowData,
          newRowData.uid,
          [columnId]
        );
      });
      test('should call saveData with new data after making changes to multiple rows', async () => {
        render(<compositions.BasicDataTableWrapper />);
        const autosaveBtn = screen.getByRole('button', { name: 'Toggle autosave' });
        await UserEvent.click(autosaveBtn);
        const dataTable = screen.getByTestId('dataTable');
        const newCellValue = 'abc';
        const columnId = 'name';
        expect(saveData).toHaveBeenCalledTimes(0);
        await editCell(dataTable, 0, columnId, newCellValue);
        expect(saveData).toHaveBeenCalledTimes(1);
        (saveData as jest.Mock).mockClear();
        await editCell(dataTable, 1, columnId, newCellValue);

        const newRowData0 = {
          ...demoTableData[0],
          name: newCellValue,
        };
        const newRowData1 = {
          ...demoTableData[1],
          name: newCellValue,
        };

        expect(saveData).toHaveBeenCalledTimes(1);
        expect(saveData).toHaveBeenCalledWith(
          [newRowData0, newRowData1, ...demoTableData.slice(2)],
          SAVE_ACTIONS.ROW_CHANGED,
          newRowData1,
          newRowData1.uid,
          [columnId]
        );
      });

      test('should call saveData with new data after making changes to multiple number rows', async () => {
        render(<compositions.BasicDataTableWrapper />);
        const heading: IHeadingNumber = demoHeadingsDataObj.count as IHeadingNumber;
        const autosaveBtn = screen.getByRole('button', { name: 'Toggle autosave' });
        await UserEvent.click(autosaveBtn);
        const dataTable = screen.getByTestId('dataTable');
        const newCellValueA = (heading.max as number) - 1;
        const newCellValueB = (heading.max as number) + 1;
        const columnId = 'count';
        expect(saveData).toHaveBeenCalledTimes(0);
        await editCell(dataTable, 0, columnId, String(newCellValueA), 'spinbutton');
        expect(saveData).toHaveBeenCalledTimes(1);
        (saveData as jest.Mock).mockClear();
        await editCell(dataTable, 1, columnId, String(newCellValueB), 'spinbutton');

        const newRowData0 = {
          ...demoTableData[0],
          count: String(newCellValueA),
        };
        const newRowData1 = {
          ...demoTableData[1],
          // count: heading.max,
        };

        expect(saveData).toHaveBeenCalledTimes(1);
        expect(saveData).toHaveBeenCalledWith(
          [newRowData0, newRowData1, ...demoTableData.slice(2)],
          SAVE_ACTIONS.ROW_CHANGED,
          newRowData1,
          newRowData1.uid,
          [columnId]
        );
      });

      test.todo('should remove row and autosave when delete row button pressed');
      // , () => {
      //   // const deleteRowBtn = component.find('.rowDeleteBtn').first();
      //   // deleteRowBtn.simulate('click');
      //   // expect(saveData).toHaveBeenCalledWith(
      //   //   DEMO_TABLE_DATA.slice(1),
      //   //   SAVE_ACTIONS.ROW_DELETED,
      //   //   null,
      //   //   DEMO_TABLE_DATA[0].uid
      //   // );
      // });
    });

    describe('Filtering', () => {
      test('should clear filters from filter manager', () => {
        // addFilter(component);
        // const initialRowCount = getRowCount(component);
        // expect(initialRowCount).toEqual(1);
        // clearFilters(component);
        // const clearedRowCount = getRowCount(component);
        // expect(clearedRowCount).toEqual(DEMO_TABLE_DATA.length);
      });

      test('should filter rows when we add a filter from filter manager', async () => {
        render(<compositions.BasicDataTableWrapper />);
        const dataTable = screen.getByTestId('dataTable');
        const rowCount = within(dataTable).getAllByTestId('cell_1_', { exact: false }).length;
        expect(rowCount).toEqual(demoTableData.length);
        const filterHeading = demoHeadingsData.find((h) => h.type === EFilterType.text);
        if (!filterHeading) throw new Error('Could not find filter heading');
        expect(filterHeading?.label).toBeTruthy();
        const filterPanel = await openFilterPanel(screen);
        const newFilter = await addFilter(within(filterPanel));
        const [fieldSelectDropdown]: HTMLSelectElement[] =
          within(newFilter).getAllByRole('combobox');
        await UserEvent.selectOptions(fieldSelectDropdown, String(filterHeading.uid));
        await within(filterPanel).findByDisplayValue(filterHeading.label);
        const operatorSelectDropdown = within(
          within(within(filterPanel).getByRole('list')).getAllByRole('listitem')[0]
        ).getByDisplayValue('is');
        await UserEvent.selectOptions(
          operatorSelectDropdown,
          comparisonMetaData[EComparisons.CONTAINS].uid
        );
        const filterTextInput = within(
          within(within(filterPanel).getByRole('list')).getAllByRole('listitem')[0]
        ).getByLabelText(`Filter ${filterHeading.label} text input`);
        await UserEvent.click(filterTextInput);
        await UserEvent.clear(filterTextInput);
        const searchString = demoTableData[0][filterHeading.uid];
        await UserEvent.keyboard(searchString);
        const rowCountFiltered = within(dataTable).getAllByTestId('cell_1_', {
          exact: false,
        }).length;
        expect(rowCountFiltered).toBeLessThan(rowCount);
      });
      test('should add correct filter data when adding new filter', () => {
        // const initialFilterData = component.find(FilterManager).props().filterData;
        // const addFilterButton = component.find(AddFilterButton).find('button');
        // addFilterButton.simulate('click');
        // component.update();
        // const updatedFilterData = component.find(FilterManager).props().filterData;
        // expect(updatedFilterData.length).toEqual(initialFilterData.length + 1);
        // expect(updatedFilterData[updatedFilterData.length - 1]).toEqual(
        //   new FilterObjectClass({
        //     field: 'uid',
        //     type: 'button',
        //     label: 'UID',
        //     filterOptionId: 'uid',
        //     value: '',
        //     uid: expect.any(String),
        //   })
        // );
      });
      test('should add correct filter data when updating filter', () => {
        // const fields = component.find(FilterManager).props().fieldsData;
        // const newFilterField = demoHeadingsData[3];
        // expect(fields[newFilterField.uid]).toEqual(newFilterField);
        // const initialFilterData = component.find(FilterManager).props().filterData;
        // const updateFilterSelect = component.find('.filterItem_filterFieldSelect').first();
        // updateFilterSelect.simulate('change', { target: { value: newFilterField.uid } });
        // component.update();
        // const updatedFilterData = component.find(FilterManager).props().filterData;
        // expect(updatedFilterData.length).toEqual(initialFilterData.length);
        // expect(updatedFilterData[0]).toEqual(
        //   new FilterObjectClass({
        //     field: newFilterField.uid,
        //     type: newFilterField.type,
        //     label: newFilterField.label,
        //     operator: comparisons.equals,
        //     filterOptionId: newFilterField.uid,
        //     value: 0,
        //     uid: expect.any(String),
        //   })
        // );
      });
    });

    describe('Cell focus and navigation', () => {
      test('Should set focus to cell on mouse hover', async () => {
        render(<compositions.BasicDataTableWrapper />);
        await clickToggleBtn('Toggle debugMode');
        const dataTable = screen.getByTestId('dataTable');
        await UserEvent.hover(dataTable);
        const columnIndex = 2;
        const rowIndex = 0;
        const cell = within(dataTable).getByTestId(`cell_${columnIndex}_${rowIndex}`, {
          exact: false,
        });
        await UserEvent.hover(cell);
        expect(screen.getByText(`Current focused column: ${columnIndex}`)).toBeInTheDocument();
        expect(screen.getByText(`Current focused row: ${rowIndex}`)).toBeInTheDocument();
      });
      test('Clicking a cell should enter edit mode in that cell', async () => {
        render(<compositions.BasicDataTableWrapper />);
        await clickToggleBtn('Toggle debugMode');
        const dataTable = screen.getByTestId('dataTable');
        const columnIndex = 2;
        const rowIndex = 0;
        const cell = within(dataTable).getByTestId(`cell_${columnIndex}_${rowIndex}`, {
          exact: false,
        });
        await UserEvent.click(cell);
        expect(screen.getByText(`Current focused column: ${columnIndex}`)).toBeInTheDocument();
        expect(screen.getByText(`Current focused row: ${rowIndex}`)).toBeInTheDocument();
        // should have editMode attribute
        expect(cell).toHaveAttribute('data-editMode');
        expect(within(cell).getByRole('textbox')).toBeInTheDocument();
      });
      test('should not exit edit mode if user hovers over another cell', async () => {
        render(<compositions.DataTableWrapperForTests />);
        await clickToggleBtn('Reset headings');
        await clickToggleBtn('Generate 2 rows');
        await clickToggleBtn('Toggle debugMode');

        const dataTable = screen.getByTestId('dataTable');
        await UserEvent.hover(dataTable);
        const columnIndex = 2;
        const rowIndex = 0;
        const cell = within(dataTable).getByTestId(`cell_${columnIndex}_${rowIndex}`, {
          exact: false,
        });
        await UserEvent.click(cell);
        expect(screen.getByText(`Current focused column: ${columnIndex}`)).toBeInTheDocument();
        expect(screen.getByText(`Current focused row: ${rowIndex}`)).toBeInTheDocument();
        // should have editMode attribute
        expect(cell).toHaveAttribute('data-editMode');
        expect(within(cell).getByRole('textbox')).toBeInTheDocument();
        const nextCell = within(dataTable).getByTestId(`cell_${columnIndex}_${rowIndex + 1}`, {
          exact: false,
        });
        await UserEvent.hover(nextCell);
        expect(screen.getByText(`Current focused column: ${columnIndex}`)).toBeInTheDocument();
        expect(screen.getByText(`Current focused row: ${rowIndex}`)).toBeInTheDocument();
        // should have editMode attribute
        expect(cell).toHaveAttribute('data-editMode');
        expect(within(cell).getByRole('textbox')).toBeInTheDocument();
      });
      test.todo('should exit edit mode if user hovers over another cell and clicks it');
      test.todo('should not change focused cell if a cell is in edit mode');
      test.todo('should still change focus cell when autosave is on');
    });
    describe('Number cells', () => {
      test.skip("should limit the value of a number cell to it's max value", async () => {
        // TODO: Implement this feature
        const columnId = 'count';
        const rowIndex = 0;
        const inputRole = 'spinbutton';
        const headings = [headingExampleNumber];
        const columnFilter = 'Number Column Only';

        render(<compositions.DataTableWrapperForTests />);
        await clickToggleBtn(columnFilter);
        await clickToggleBtn('Generate 1 row');
        const tableData = generateDemoTableDataFilteredByColumns(1, headings);
        const dataTable = screen.getByTestId('dataTable');
        expect(getCellContent(dataTable, rowIndex, columnId)).toEqual(
          String(tableData[rowIndex][columnId])
        );
        expect(headings[0].max).toBeGreaterThan(tableData[rowIndex][columnId]);
        const newCellValue = (headings[0].max as number) + 1;
        await editCell(dataTable, rowIndex, columnId, String(newCellValue), inputRole);
        expect(getCellContent(dataTable, rowIndex, columnId)).toEqual(String(headings[0].max));
      });
      test('should allow setting invalid values into a number field but reset when accepted', async () => {
        const columnId = 'count';
        const rowIndex = 0;
        const inputRole = 'spinbutton';
        const headings = [headingExampleNumber];
        const columnFilter = 'Number Column Only';

        render(<compositions.DataTableWrapperForTests />);
        await clickToggleBtn(columnFilter);
        await clickToggleBtn('Generate 1 row');
        const tableData = generateDemoTableDataFilteredByColumns(1, headings);
        const dataTable = screen.getByTestId('dataTable');
        expect(getCellContent(dataTable, rowIndex, columnId)).toEqual(
          String(tableData[rowIndex][columnId])
        );
        expect(headings[0].min).toBeLessThan(tableData[rowIndex][columnId]);

        const newCellValue = (headings[0].min as number) - 1;
        await editCell(dataTable, rowIndex, columnId, String(newCellValue), inputRole, false);
        await waitFor(() => {
          const columnCells = within(dataTable).getAllByTestId(`cell_${columnId}`, {
            exact: false,
          });
          const cell = columnCells[rowIndex];
          const value = (within(cell).getByRole('spinbutton') as HTMLInputElement).value;
          expect(value).toEqual(String(newCellValue));
        });

        await UserEvent.click(dataTable);
        expect(getCellContent(dataTable, rowIndex, columnId)).toEqual(
          tableData[rowIndex][columnId].toString()
        );
      });
      describe('Validation highlighting', () => {
        test("should indicate row has validation warning with ! on row status button", async()=> {
          const columnId = 'count';
          const rowIndex = 0;
          const inputRole = 'spinbutton';
          const headings = [headingExampleNumber];
          const columnFilter = 'Number Column Only';

          render(<compositions.DataTableWrapperForTests />);
          await clickToggleBtn(columnFilter);
          await clickToggleBtn('Generate 1 row');
          const tableData = generateDemoTableDataFilteredByColumns(1, headings);
          const dataTable = screen.getByTestId('dataTable');
          expect(getCellContent(dataTable, rowIndex, columnId)).toEqual(
            String(tableData[rowIndex][columnId])
          );
          expect(headings[0].min).toBeLessThan(tableData[rowIndex][columnId]);

          const newCellValue = (headings[0].min as number) - 1;
          await editCell(dataTable, rowIndex, columnId, String(newCellValue), inputRole, false);
          await waitFor(() => {
            const columnCells = within(dataTable).getAllByTestId(`cell_${columnId}`, {
              exact: false,
            });
            const cell = columnCells[rowIndex];
            const value = (within(cell).getByRole('spinbutton') as HTMLInputElement).value;
            expect(value).toEqual(String(newCellValue));
          });
          const rowStatusBtn = within(dataTable).getByTestId(`rowStatusBtn_${rowIndex}`, {
            exact: false,
          });
          expect(rowStatusBtn).toHaveTextContent('!');
        })
        test.todo("should show validation message popup on clicking row status button");
        test.todo("Should highlight rows that are invalid with a 'warning' class");
        test.todo("should highlight cells with validation issues with a 'warning' class");
      });
    });

    // describe('Row selecting', () => {
    //   beforeEach(() => {
    //     component = mount(
    //       <DataTableWrapper
    //         {...{ ...defaultProps, config: { ...DEMO_CONFIG, allowSelection: true } }}
    //       />
    //     );
    //     clearFilters(component);
    //     component.update();
    //   });
    //   const selectNthRow = (c, n) => {
    //     const firstRowSelectionBox = c.find('.rowSelectionBox').at(n);
    //     firstRowSelectionBox.simulate('change');
    //     c.update();
    //   };
    //   const selectAll = (c) => {
    //     const selectAllBtn = c.find('.selectAllBtn');
    //     selectAllBtn.simulate('click');
    //     c.update();
    //   };

    //   const clearSelection = (c) => {
    //     const clearSelectionBtn = c.find('.clearSelectionBtn');
    //     clearSelectionBtn.simulate('click');
    //     c.update();
    //   };
    //   test('should pass current selection to row selection boxes', () => {
    //     const rowSelectionBoxes = component.find('.rowSelectionBox');
    //     expect(rowSelectionBoxes.everyWhere((node) => !node.props().checked)).toBeTruthy();
    //     selectNthRow(component, 0);
    //     const firstRowSelectionBox = component.find('.rowSelectionBox').first();
    //     expect(firstRowSelectionBox.props().checked).toBeTruthy();
    //   });

    //   test('should call onSelectionChange when we select a row', () => {
    //     expect(onSelectionChange).not.toHaveBeenCalled();
    //     selectNthRow(component, 0);
    //     expect(onSelectionChange).toHaveBeenCalledWith([DEMO_TABLE_DATA[0]]);
    //   });
    //   test('should maintain correct selection when filters change', () => {
    //     selectNthRow(component, 2);
    //     let rowSelectionBox = component.find('.rowSelectionBox').at(2);
    //     expect(rowSelectionBox.props().checked).toBeTruthy();
    //     let currentSelection = component.find(DataTableUi).props().currentSelectionIds;
    //     expect(currentSelection).toEqual([DEMO_TABLE_DATA[2].uid]);

    //     addFilter(component, 2);

    //     currentSelection = component.find(DataTableUi).props().currentSelectionIds;
    //     expect(currentSelection).toEqual([DEMO_TABLE_DATA[2].uid]);

    //     rowSelectionBox = component.find('.rowSelectionBox').at(0);
    //     expect(rowSelectionBox.props().checked).toBeTruthy();
    //   });
    //   test('should remove non visable rows from selection when filters change', () => {
    //     selectAll(component);
    //     onSelectionChange.mockClear();
    //     addFilter(component, 0);
    //     expect(onSelectionChange).toHaveBeenCalledWith([DEMO_TABLE_DATA[0]]);
    //   });

    //   test('should remove from selection when we click a selected row checkbox', () => {
    //     selectNthRow(component, 0);
    //     selectNthRow(component, 0);
    //     const firstRowSelectionBox = component.find('.rowSelectionBox').first();
    //     expect(firstRowSelectionBox.props().checked).toEqual(false);
    //   });
    //   test('should call onSelectionChange when we deselect a row', () => {
    //     expect(onSelectionChange).not.toHaveBeenCalled();
    //     selectNthRow(component, 0);
    //     selectNthRow(component, 1);
    //     onSelectionChange.mockClear();
    //     selectNthRow(component, 0);
    //     expect(onSelectionChange).toHaveBeenCalledWith([DEMO_TABLE_DATA[1]]);
    //   });
    //   test('should select all with select button', () => {
    //     let rowSelectionBoxes = component.find('.rowSelectionBox');
    //     expect(rowSelectionBoxes.everyWhere((node) => !node.props().checked)).toBeTruthy();
    //     selectAll(component);
    //     rowSelectionBoxes = component.find('.rowSelectionBox');
    //     expect(rowSelectionBoxes.everyWhere((node) => node.props().checked)).toBeTruthy();
    //   });
    //   test('should call onSelectionChange with all data on selectAllBtn click', () => {
    //     selectAll(component);
    //     expect(onSelectionChange).toHaveBeenCalledWith(DEMO_TABLE_DATA);
    //   });
    //   test('should only select filtered items with select all button', () => {
    //     addFilter(component, 2);
    //     selectAll(component);
    //     expect(onSelectionChange).toHaveBeenCalledWith(DEMO_TABLE_DATA.filter((d, i) => i === 2));
    //   });
    //   test('should clear selection on clearSelection btn click', () => {
    //     selectAll(component);
    //     onSelectionChange.mockClear();
    //     clearSelection(component);
    //     expect(onSelectionChange).toHaveBeenCalledWith([]);
    //   });
    // });
    // describe('Cell Navigation', () => {
    //   const pressKeyOnFocusedNavBtn = (c, key) => {
    //     const navigationBtn = c.find('.navigationButton.focused');
    //     navigationBtn.simulate('keyDown', { key });
    //     c.update();
    //   };
    //   const getCurrentFocusedCell = (c) => {
    //     const grid = c.find(Grid);
    //     const col = grid.props().itemData.currentFocusedColumn;
    //     const row = grid.props().itemData.currentFocusedRow;
    //     return [col, row];
    //   };

    //   beforeEach(() => {
    //     component = mount(
    //       <DataTableWrapper
    //         {...{
    //           ...defaultProps,
    //           config: { ...DEMO_CONFIG, allowSelection: true, hasBtnsColumn: false },
    //         }}
    //       />
    //     );
    //     clearFilters(component);
    //     component.update();
    //   });
    //   test('should be able to move around cells with arrow keys', () => {
    //     const [col, row] = getCurrentFocusedCell(component);
    //     pressKeyOnFocusedNavBtn(component, 'ArrowRight');
    //     const [colNext, rowNext] = getCurrentFocusedCell(component);
    //     expect(row).toEqual(rowNext);
    //     expect(col + 1).toEqual(colNext);
    //   });

    //   test('should be able to move around cells with arrow keys after deleting a row', () => {
    //     const deleteRowBtn = component.find('.rowDeleteBtn').at(1);
    //     deleteRowBtn.simulate('click');
    //     const [col, row] = getCurrentFocusedCell(component);
    //     pressKeyOnFocusedNavBtn(component, 'ArrowRight');
    //     pressKeyOnFocusedNavBtn(component, 'ArrowDown');
    //     const [colNext, rowNext] = getCurrentFocusedCell(component);
    //     expect(row + 1).toEqual(rowNext);
    //     expect(col + 1).toEqual(colNext);
    //   });
    //   test('should move to next row when navigating with arrow keys', () => {
    //     const [, row] = getCurrentFocusedCell(component);
    //     for (let index = 0; index < DEMO_HEADINGS.length; index += 1) {
    //       pressKeyOnFocusedNavBtn(component, 'ArrowRight');
    //     }
    //     const [, rowNext] = getCurrentFocusedCell(component);
    //     expect(rowNext).toEqual(row + 1);
    //   });

    //   test('should be able to enter cell edit mode with enter key', () => {
    //     pressKeyOnFocusedNavBtn(component, 'ArrowRight');
    //     pressKeyOnFocusedNavBtn(component, 'Enter');
    //     const textCell = component.find(DataTableCellText).filterWhere((n) => n.props().focused);
    //     expect(textCell.props().columnData.type).toEqual('text');
    //     expect(textCell.props().editMode).toEqual(true);

    //     const textCellInput = component
    //       .find(DataTableDataCell)
    //       .filterWhere((n) => n.props().focused)
    //       .find('.cellInput-text');

    //     const focusedElement = document.activeElement;
    //     expect(textCellInput.getDOMNode()).toBe(focusedElement);
    //   });

    //   test('should be able to exit cell edit mode with escape key', () => {
    //     pressKeyOnFocusedNavBtn(component, 'ArrowRight');
    //     pressKeyOnFocusedNavBtn(component, 'Enter');
    //     const textCell = component
    //       .find(DataTableDataCell)
    //       .filterWhere((n) => n.props().focused)
    //       .find('.cellInput-text');
    //     textCell.simulate('keyDown', { key: 'Escape' });

    //     const navigationBtn = component.find('.navigationButton.focused');
    //     const focusedElement = document.activeElement;
    //     expect(navigationBtn.getDOMNode()).toBe(focusedElement);
    //   });

    //   test('should be able to exit cell edit mode with enter key', () => {
    //     pressKeyOnFocusedNavBtn(component, 'ArrowRight');
    //     pressKeyOnFocusedNavBtn(component, 'Enter');
    //     const textCell = component
    //       .find(DataTableDataCell)
    //       .filterWhere((n) => n.props().focused)
    //       .find('.cellInput-text');
    //     textCell.simulate('keyDown', { key: 'Enter' });

    //     const navigationBtn = component.find('.navigationButton.focused');
    //     const focusedElement = document.activeElement;
    //     expect(navigationBtn.getDOMNode()).toBe(focusedElement);
    //   });

    //   test('should be able to exit cell edit mode with enter key after changes', () => {
    //     pressKeyOnFocusedNavBtn(component, 'ArrowRight');
    //     pressKeyOnFocusedNavBtn(component, 'Enter');
    //     const textCell = component
    //       .find(DataTableDataCell)
    //       .filterWhere((n) => n.props().focused)
    //       .find('.cellInput-textarea');
    //     textCell.simulate('change', { target: { value: 'a' } });
    //     const textCellAfterEdit = component
    //       .find(DataTableDataCell)
    //       .filterWhere((n) => n.props().focused)
    //       .find('.cellInput-textarea');
    //     expect(textCellAfterEdit.props().value).toEqual('a');

    //     textCell.simulate('keyDown', { key: 'Enter' });

    //     const navigationBtn = component.find('.navigationButton.focused');
    //     const focusedElement = document.activeElement;
    //     expect(navigationBtn.getDOMNode()).toBe(focusedElement);
    //   });
    // });
    // describe('Adding a new row', () => {
    //   const DEMO_TABLE_DATA_SIMPLE = Object.values(demoTableDataSimple);
    //   const DEMO_HEADINGS_SIMPLE = demoHeadingsDataSimple.filter((h) => h.uid !== 'uid');
    //   beforeEach(() => {
    //     component = mount(
    //       <DataTableWrapper
    //         {...defaultProps}
    //         autoSave
    //         data={DEMO_TABLE_DATA_SIMPLE}
    //         headings={DEMO_HEADINGS_SIMPLE}
    //       />
    //     );
    //   });
    //   test('should add a new data row when we click the add row button', () => {
    //     const addRowButton = component.find('.addRowBtn');
    //     addRowButton.simulate('click');
    //     component.update();
    //     const newRowData = DEMO_HEADINGS_SIMPLE.reduce(
    //       (acc, k) => ({ ...acc, [k.uid]: k.defaultValue }),
    //       { uid: expect.any(String) }
    //     );
    //     expect(saveData).toHaveBeenCalledWith(
    //       [...DEMO_TABLE_DATA_SIMPLE, newRowData],
    //       SAVE_ACTIONS.ROW_ADDED,
    //       newRowData,
    //       newRowData.uid
    //     );
    //   });
    //   test('should add a new row when we try to hover over row greater than row count', () => {
    //     const cell = component.find(Cell).first();
    //     const targetRow = 2;
    //     cell.props().data.handleMoveFocusToTargetRow(targetRow, DEMO_HEADINGS_SIMPLE.length);
    //     component.update();
    //     const newRowData = DEMO_HEADINGS_SIMPLE.reduce(
    //       (acc, k) => ({ ...acc, [k.uid]: k.defaultValue }),
    //       { uid: expect.any(String) }
    //     );
    //     expect(saveData).toHaveBeenCalledWith(
    //       [...DEMO_TABLE_DATA_SIMPLE, newRowData],
    //       SAVE_ACTIONS.ROW_ADDED,
    //       newRowData,
    //       newRowData.uid
    //     );
    //   });
    // });
    // describe('evaluating cells', () => {
    //   beforeEach(() => {
    //     component = mount(<DataTableWrapper {...defaultProps} />);
    //     component.setProps({
    //       data: DEMO_TABLE_DATA.map((row) => ({ ...row, customfield: 2 })),
    //     });
    //     component.update();
    //     component.update();
    //   });
    //   test('should evaluate number field', () => {
    //     //
    //   });
    //   test('should evaluate custom eval field', () => {
    //     const customField = () => component.find(CustomField).first();
    //     // console.log(component.find(DataTableUi).debug());
    //     expect(customField().exists()).toBeTruthy();
    //     expect(customField().props().cellData).toEqual(2);
    //     const customFieldEval = () =>
    //       component
    //         .find(DataTableCellNumber)
    //         .filterWhere((c) => c.props().columnData.uid === 'customfieldeval')
    //         .first();
    //     expect(customFieldEval().exists()).toBeTruthy();
    //     expect(customFieldEval().props().cellData).toEqual(2 + 1);
    //     const newVal = 3;
    //     customField().props().acceptValue(3);
    //     component.update();
    //     component.update();
    //     component.update();
    //     expect(customFieldEval().props().cellData).toEqual(newVal + 1);
    //     const saveBtn = component.find(DataTableBottomMenu).props().handleSaveBtnClick;
    //     saveBtn();
    //     expect(saveData.mock.calls[0][0][0].customfield).toEqual(newVal);
    //   });
    // });
  });
});
