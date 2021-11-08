import React from 'react';
import { render } from '@testing-library/react';
import { BasicFieldReadOnly } from './field-read-only.composition';


it('should render with the correct text', () => {
  const { getByText } = render(<BasicFieldReadOnly />);
  const rendered = getByText('hello from FieldReadOnly');
  expect(rendered).toBeTruthy();
});

