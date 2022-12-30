import React from 'react';
import { render } from '@testing-library/react';

import * as compositions from './error-boundary.composition';

describe('ErrorBoundary', () => {
  let consoleError;
  beforeAll(() => {
    consoleError = console.error.bind(console.error);
    console.error = (errormessage) => {
      return;
      const suppressedErrors =
        errormessage.toString().includes('Warning: Failed prop type:') ||
        errormessage.toString().includes('Error: Uncaught [TypeError: Initial');
      !suppressedErrors && consoleError(errormessage);
    };
  });
  afterAll(() => {
    console.error = consoleError;
  });
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, async () => {
        render(<Composition />);
        // @ts-ignore
        if (Composition.waitForReady) await Composition.waitForReady();
      });
    });
  });
});
