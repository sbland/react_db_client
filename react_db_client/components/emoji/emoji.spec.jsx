import React from 'react';
import { render } from '@testing-library/react';
import { BasicEmoji } from './emoji.composition';


it('should render with the correct text', () => {
  const { getByText } = render(<BasicEmoji />);
  const rendered = getByText('😀');
  expect(rendered).toBeTruthy();
});

