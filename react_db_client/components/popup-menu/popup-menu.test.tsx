import React from 'react';
import { render } from '@testing-library/react';

import * as compositions from './popup-menu.composition';

describe('Popup Menu', () => {
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
