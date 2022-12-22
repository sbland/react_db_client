import React from 'react';
import { render, screen } from '@testing-library/react';
import * as compositions from './item-editor.composition';

describe('BasicItemEditor', () => {
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
  describe('Functional Tests', () => {
    test('should render item editor', async () => {
      render(<compositions.BasicItemEditor />);
      await screen.findByTestId('rdc-itemEditor');
    });
  });
});
