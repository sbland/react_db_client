import React from 'react';
import { render } from '@testing-library/react';
import { BasicCellTypes } from './cell-types.composition';


it('should render with the correct text', () => {
  const { getByText } = render(<BasicCellTypes />);
  const rendered = getByText('hello from CellTypes');
  expect(rendered).toBeTruthy();
});

