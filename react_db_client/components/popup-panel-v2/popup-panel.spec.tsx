import React from 'react';
import { render, screen } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import { BasicPopupPanel } from './popup-panel.composition';

it('should not render popup when not open', () => {
  expect(screen.queryByText('hello world!')).not.toBeInTheDocument();
});

it('should render with the correct text', async () => {
  render(<BasicPopupPanel />);
  const openBtn = screen.getByRole('button');
  await UserEvent.click(openBtn);
  const rendered = await screen.findByText('hello world!');
  expect(rendered).toBeTruthy();
});
