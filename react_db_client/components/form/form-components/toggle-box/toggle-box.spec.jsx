import React from 'react';
import { render } from '@testing-library/react';
import { BasicToggleBox } from './toggle-box.composition';


it('should render with the correct text', () => {
  const { getByText } = render(<BasicToggleBox />);
  const rendered = getByText('hello from ToggleBox');
  expect(rendered).toBeTruthy();
});

