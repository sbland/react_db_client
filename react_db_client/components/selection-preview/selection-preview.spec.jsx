import React from 'react';
import { render } from '@testing-library/react';
import { BasicSelectionPreview } from './selection-preview.composition';


it('should render with the correct text', () => {
  const { getByText } = render(<BasicSelectionPreview />);
  const rendered = getByText('hello from SelectionPreview');
  expect(rendered).toBeTruthy();
});

