import React from 'react';
import { render } from '@testing-library/react';

import * as compositions from './file-manager.composition';

Date.now = jest.fn(() => 123); //14.02.2017

describe('file-manager', () => {
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, async () => {
        render(<Composition />);
        if (Composition.waitForReady) await Composition.waitForReady();
      });
    });
  });
});
