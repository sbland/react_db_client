import React from 'react';
import { render, fireEvent, within, act } from '@testing-library/react';
import { ISearchAndSelectProps, SearchAndSelect } from './search-and-select';
import { demoResultData, demoHeadingsData, IResultExample } from './demo-data';
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

describe('SearchAndSelect', () => {
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, () => {
        render(<Composition />);
      });
    });
  });
  describe('Unit Tests', () => {
    beforeEach(() => {
      render(<SearchAndSelect  {...defaultProps} />);
    });
    test('should work', () => {
      //
    });
  });
});
