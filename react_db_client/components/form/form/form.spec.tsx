import React from 'react';
import { render } from '@testing-library/react';
import { BasicForm } from './form.composition';

it('should render with the correct text', () => {
  const { getByText } = render(<BasicForm />);
  const rendered = getByText('hello from Form');
  expect(rendered).toBeTruthy();
});
