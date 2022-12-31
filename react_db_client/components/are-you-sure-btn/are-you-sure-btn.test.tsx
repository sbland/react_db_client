import React from 'react';
import { screen, render, within } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';

import * as compositions from './are-you-sure-btn.composition';

describe('Are you sure button', () => {
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, async () => {
        render(<Composition />);
        // @ts-ignore
        if (Composition.waitForReady) await Composition.waitForReady();
      });
    });
  });

  describe('are you sure process', () => {
    test('should call confirm id when we click accept button in are you sure panel', async () => {
      render(<compositions.BasicAreYouSureBtn />);
      const btn = screen.getByRole('button');
      await UserEvent.click(btn);
      await screen.findByText('Are You Sure?');
      const acceptBtn = screen.getByRole('button', { name: /Confirm/ });
      await UserEvent.click(acceptBtn);
      await screen.findByText('User confirmed');
    });
  });
});
