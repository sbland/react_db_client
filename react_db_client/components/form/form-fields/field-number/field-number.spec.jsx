import React from 'react';
import { render } from '@testing-library/react';
import { BasicFieldNumber } from './field-number.composition';


it('should render with the correct text', () => {
  const { getByText } = render(<BasicFieldNumber />);
  const rendered = getByText('hello from FieldNumber');
  expect(rendered).toBeTruthy();
});

