import React from 'react';
import { render } from '@testing-library/react';
import { BasicFieldDate } from './field-date.composition';

it('should render with the correct value', () => {
  const { getByText } = render(<BasicFieldDate />);
  const rendered = getByText('hello from FieldDate');
  expect(rendered).toBeTruthy();
});
