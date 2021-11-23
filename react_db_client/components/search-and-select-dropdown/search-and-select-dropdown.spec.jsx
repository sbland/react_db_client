import React from 'react';
import { render } from '@testing-library/react';
import { BasicSearchAndSelectDropdown } from './search-and-select-dropdown.composition';


it('should render with the correct text', () => {
  const { getByText } = render(<BasicSearchAndSelectDropdown />);
  const rendered = getByText('hello from SearchAndSelectDropdown');
  expect(rendered).toBeTruthy();
});

