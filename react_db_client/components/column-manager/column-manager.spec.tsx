import React from 'react';
import { render } from '@testing-library/react';
import { BasicColumnManager } from './column-manager.composition';

it('should render with the correct text', () => {
  const { getByText } = render(<BasicColumnManager />);
  const rendered = getByText('hello from ColumnManager');
  expect(rendered).toBeTruthy();
});
