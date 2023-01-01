import React from 'react';
import { screen, render, within } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import { ISearchAndSelectProps, SearchAndSelect } from './search-and-select';
import { demoResultData, demoHeadingsData, IResultExample, extraResult } from './demo-data';
import * as compositions from './search-and-select.composition';

const searchFunction = jest.fn().mockImplementation(async () => demoResultData);
const handleSelect = jest.fn();
Date.now = jest.fn(() => 123); //14.02.2017

const defaultProps: ISearchAndSelectProps<IResultExample> = {
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
        const liveUpdateButton = screen.getByRole('button', { name: /Live Update/ });
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
        expect(mockAlert).toHaveBeenCalledWith(demoResultData[0]);
      });

      test('should return selection when selecting from results with alt id', async () => {
        render(<compositions.SearchExampleForTestsAltReturnField />);
        await compositions.SearchExampleForTestsAltReturnField.waitForReady();
        const liveUpdateButton = screen.getByRole('button', { name: /Live Update/ });
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
        expect(mockAlert).toHaveBeenCalledWith(demoResultData[0]);
      });
    });
  });
});
