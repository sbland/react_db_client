import React from 'react';
import { render } from '@testing-library/react';
import { BasicMultiSelectDropdown } from './multi-select-dropdown.composition';


it('should render with the correct text', () => {
  const { getByText } = render(<BasicMultiSelectDropdown />);
  const rendered = getByText('hello from MultiSelectDropdown');
  expect(rendered).toBeTruthy();
});

