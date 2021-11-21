import React from 'react';
import { render } from '@testing-library/react';
import { BasicFieldObjectRef } from './field-object-ref.composition';

it('should render with the correct value', () => {
  const { getByText } = render(<BasicFieldObjectRef />);
  const rendered = getByText('hello from FieldObjectRef');
  expect(rendered).toBeTruthy();
});
