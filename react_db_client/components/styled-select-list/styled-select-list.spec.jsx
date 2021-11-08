import React from 'react';
import { render } from '@testing-library/react';
import { BasicStyledSelectList } from './styled-select-list.composition';


it('should render with the correct text', () => {
  const { getByText } = render(<BasicStyledSelectList />);
  const rendered = getByText('hello from StyledSelectList');
  expect(rendered).toBeTruthy();
});

