import React from 'react';
import { render } from '@testing-library/react';
import { BasicFilterManager } from './filter-manager.composition';


it('should render with the correct text', () => {
  const { getByText } = render(<BasicFilterManager />);
  const rendered = getByText('hello from FilterManager');
  expect(rendered).toBeTruthy();
});

