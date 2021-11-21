import React from 'react';
import { render } from '@testing-library/react';
import { BasicBubbleSelector } from './bubble-selector.composition';


it('should render with the correct text', () => {
  const { getByText } = render(<BasicBubbleSelector />);
  const rendered = getByText('hello from BubbleSelector');
  expect(rendered).toBeTruthy();
});

