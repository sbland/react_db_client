import React from 'react';
import { render } from '@testing-library/react';
import { BasicFieldText } from './field-text.composition';


it('should render with the correct text', () => {
  const { getByText } = render(<BasicFieldText />);
  const rendered = getByText('hello from FieldText');
  expect(rendered).toBeTruthy();
});

