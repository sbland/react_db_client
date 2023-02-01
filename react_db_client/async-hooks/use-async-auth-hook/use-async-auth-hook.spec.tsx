import React from 'react';
import { render } from '@testing-library/react';
import * as compositions from './use-async-auth-hook.composition';

describe('useAsyncAuthHook', () => {
  describe('Compositions', () => {
    Object.entries(compositions)
      .forEach(([name, Composition]) => {
        test(name, async () => {
          render(<Composition />);
          // @ts-ignore
          if (Composition.waitForReady) await Composition.waitForReady();
        });
      });
  });
  describe('CallFn', () => {
    //
   })
});
