import React from 'react';
import { render } from '@testing-library/react';
import { BasicFieldMultiSelect } from './field-multi-select.composition';

it('should render with the correct value', () => {
  const { getByText } = render(<BasicFieldMultiSelect />);
  const rendered = getByText('hello from FieldMultiSelect');
  expect(rendered).toBeTruthy();
});
