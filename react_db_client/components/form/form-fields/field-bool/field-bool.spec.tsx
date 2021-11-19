import React from 'react';
import { render } from '@testing-library/react';
import { BasicFieldBool } from './field-bool.composition';

it('should render with the correct value', () => {
  const { getByText } = render(<BasicFieldBool />);
  const rendered = getByText('hello from FieldBool');
  expect(rendered).toBeTruthy();
});
