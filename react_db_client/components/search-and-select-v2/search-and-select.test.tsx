import React from 'react';
import { screen, render, within, waitFor } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import { ISearchAndSelectProps, SearchAndSelect } from './search-and-select';
import { demoResultData, demoHeadingsData, IResultExample } from './demo-data';
import * as compositions from './search-and-select.composition';

const searchFunction = jest.fn().mockImplementation(async () => demoResultData);
const handleSelect = jest.fn();
Date.now = jest.fn(() => 123); //14.02.2017

const defaultProps: ISearchAndSelectProps<IResultExample> = {
  id: 'Example SAS',
  searchFunction,
  initialFilters: [],
  availableFilters: {},
  handleSelect,
  headings: demoHeadingsData,
  previewHeadings: demoHeadingsData,
};

describe('SearchAndSelect', () => {
  describe('Compositions', () => {
    Object.entries(compositions)
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
    describe('standard', () => {
      beforeEach(() => {
        render(<SearchAndSelect {...defaultProps} />);
      });
      test('should work', () => {});
    });
    describe('Filters', () => {
      test.todo('should be able to change search function');
    });

    describe('Selecting results', () => {
      let realWindow;
      const mockAlert = jest.fn();
      beforeEach(() => {
        /* Backup mocked globals */
        window.alert = mockAlert;
      });

      afterEach(() => {
        // eslint-disable-next-line no-global-assign
        window = realWindow;
      });
      test('should return selection when selecting from results', async () => {
        render(<compositions.SearchExampleForTests />);
        await compositions.SearchExampleForTests.waitForReady();
        const liveUpdateButton = screen.getByRole('button', {
          name: /Live Update/,
        });
        await UserEvent.click(liveUpdateButton);
        await screen.findByText(demoResultData[0].uid);
        const resultsList = screen
          .getAllByRole('list')
          .find((c) => within(c).queryByText(demoResultData[0].name));
        expect(resultsList).toBeInTheDocument();
        const resultsListItems = within(resultsList as HTMLUListElement).getAllByRole('listitem');
        expect(resultsListItems.length).toBeGreaterThan(0);
        const firstItem = within(resultsListItems[0]).getByRole('button');
        await UserEvent.click(firstItem);
        expect(
          JSON.parse(screen.getByTestId('sas-composition-selectionState').textContent || '{}')
        ).toEqual([demoResultData[0]]);
      });

      test('should return selection when selecting from results with alt id', async () => {
        render(<compositions.SearchExampleForTestsAltReturnField />);
        await compositions.SearchExampleForTestsAltReturnField.waitForReady();
        const liveUpdateButton = screen.getByRole('button', {
          name: /Live Update/,
        });
        await UserEvent.click(liveUpdateButton);
        await screen.findByText(demoResultData[0].uid);
        const resultsList = screen
          .getAllByRole('list')
          .find((c) => within(c).queryByText(demoResultData[0].name));
        expect(resultsList).toBeInTheDocument();
        const resultsListItems = within(resultsList as HTMLUListElement).getAllByRole('listitem');
        expect(resultsListItems.length).toBeGreaterThan(0);
        const firstItem = within(resultsListItems[0]).getByRole('button');
        await UserEvent.click(firstItem);
        await waitFor(() =>
          expect(screen.getByTestId('sas-composition-selectionState').textContent).not.toEqual('[]')
        );
        expect(
          JSON.parse(screen.getByTestId('sas-composition-selectionState').textContent || '{}')
        ).toEqual([demoResultData[0]]);
      });
      test('should return all when clicking select all button', async () => {
        render(<compositions.SearchExampleForTests />);
        await compositions.SearchExampleForTests.waitForReady();
        const liveUpdateButton = screen.getByRole('button', {
          name: /Live Update/,
        });
        await UserEvent.click(liveUpdateButton);
        await screen.findByText(demoResultData[0].uid);
        const resultsList = screen
          .getAllByRole('list')
          .find((c) => within(c).queryByText(demoResultData[0].name));
        expect(resultsList).toBeInTheDocument();
        const resultsListItems = within(resultsList as HTMLUListElement).getAllByRole('listitem');
        expect(resultsListItems.length).toBeGreaterThan(1);
        const selectAllBtn = screen.getByRole('button', { name: 'Select All' });
        await UserEvent.click(selectAllBtn);

        expect(
          JSON.parse(screen.getByTestId('sas-composition-selectionState').textContent || '{}')
        ).toEqual(demoResultData);
      });
    });
    describe('showing results stats', () => {
      test('should show the total number of results returned', async () => {
        render(<compositions.SearchExampleForTests />);
        await compositions.SearchExampleForTests.waitForReady();
        const liveUpdateButton = screen.getByRole('button', {
          name: /Live Update/,
        });
        await UserEvent.click(liveUpdateButton);
        await screen.findByText('Showing 3 of 3');
      });
    });
  });
});
