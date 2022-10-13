import React from 'react';
import { render } from '@testing-library/react';
import * as compositions from './search-and-select-dropdown.composition';

describe('SearchAndSelect', () => {
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, () => {
        render(<Composition />);
      });
    });
  });
});
