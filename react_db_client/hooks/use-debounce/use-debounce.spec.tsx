import React from 'react';
import { screen, render } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import * as compositions from './use-debounce.composition';

describe('useDebounce Hook', () => {
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, async () => {
        render(<Composition />);
        // @ts-ignore
        if (Composition.waitForReady) await Composition.waitForReady();
      });
    });
  });
  describe('CallFn', () => {
    test('should increase the callcount by 1 if we press the button once', async () => {
      render(<compositions.ExampleUseDebounceHookUsage />);
      const button = screen.getByRole('button');
      expect(screen.getByTestId('callcount').textContent).toEqual(
        'callCount: 0'
      );
      await UserEvent.click(button);
      await screen.findByText('Called');
      expect(screen.getByTestId('callcount').textContent).toEqual(
        'callCount: 1'
      );
    });
    test('should increase the callcount by 1 if we press the button multiple times', async () => {
      render(<compositions.ExampleUseDebounceHookUsage />);
      const button = screen.getByRole('button');
      expect(screen.getByTestId('callcount').textContent).toEqual(
        'callCount: 0'
      );
      await UserEvent.click(button);
      await UserEvent.click(button);
      await UserEvent.click(button);
      await screen.findByText('Called');
      expect(screen.getByTestId('callcount').textContent).toEqual(
        'callCount: 1'
      );
    });
    test('should catch errors', async () => {
      render(<compositions.ExampleUseDebounceHookUsageCatchError />);
      const button = screen.getByRole('button');
      expect(screen.getByTestId('errorMessage').textContent).toEqual('error: null');
      await UserEvent.click(button);
      await screen.findByText('Has Called');
      expect(screen.getByTestId('errorMessage').textContent).toEqual(
        'error: Error: Example error'
      );
    });
  });
});
