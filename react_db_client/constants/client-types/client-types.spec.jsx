import React from 'react';
import { render } from '@testing-library/react';
import { BasicClientTypes } from './client-types.composition';


it('should render with the correct text', () => {
  const { getByText } = render(<BasicClientTypes />);
  const rendered = getByText('hello from ClientTypes');
  expect(rendered).toBeTruthy();
});

