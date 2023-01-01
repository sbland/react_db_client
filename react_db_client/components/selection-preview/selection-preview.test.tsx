import React from 'react';
import { render } from '@testing-library/react';

import * as compositions from './selection-preview.composition';

describe('Selection Preview', () => {
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
    test.todo('should show meta info on document');
  });
});
