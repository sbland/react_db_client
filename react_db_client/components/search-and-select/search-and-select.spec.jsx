import React from 'react';
import { render } from '@testing-library/react';
import { BasicSearchAndSelect } from './search-and-select.composition';


it('should render with the correct text', () => {
  const { getByText } = render(<BasicSearchAndSelect />);
  const rendered = getByText('hello from SearchAndSelect');
  expect(rendered).toBeTruthy();
});

