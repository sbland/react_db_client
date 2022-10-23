import React from 'react';
import { screen, render, within, act } from '@testing-library/react';
import { ISearchAndSelectProps, SearchAndSelect } from './search-and-select';
import { demoResultData, demoHeadingsData, IResultExample, extraResult } from './demo-data';
import * as compositions from './search-and-select.composition';

const searchFunction = jest.fn().mockImplementation(async () => demoResultData);
const handleSelect = jest.fn();

const defaultProps: ISearchAndSelectProps<IResultExample> = {
  searchFunction,
  initialFilters: [],
  availableFilters: {},
  handleSelect,
  headings: demoHeadingsData,
  previewHeadings: demoHeadingsData,
};

jest.useFakeTimers('modern');
const runOnlyPendingTimers = async () =>
  await act(async () => {
    jest.runOnlyPendingTimers();
  });

describe('SearchAndSelect', () => {
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
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
    describe('Changing Props', () => {
      test('should be able to change search function', async () => {
        render(<compositions.SelectSearchFn />);
        await runOnlyPendingTimers();
        const resultsList = screen.getByTestId('styledSelectList');
        await within(resultsList).findAllByText(demoResultData[0].name);
        // TODO: Fix this test
        // const results = await within(resultsList).findAllByRole('listitem');
        // const initialResultsCount = results.length;
        // expect(initialResultsCount).toBeGreaterThan(0);
        // const switchFuncSelect = screen.getByRole('button', {name: /Select/})
        // await UserEvent.click(switchFuncSelect);

        // await waitFor(() => screen.getByText(extraResult.name));

        // const resultsListB = screen.getByTestId("styledSelectList");
        // await within(resultsListB).findAllByText(demoResultData[0].name);
        // const results = await within(resultsListB).findAllByRole('listitem');
        // const initialResultsCount = results.length;
        // expect(initialResultsCount).toBeGreaterThan(0);
      });
    });
  });
});
