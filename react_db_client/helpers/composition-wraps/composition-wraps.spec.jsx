import React from 'react';
import { render } from '@testing-library/react';
import { BasicCompositionWraps } from './composition-wraps.composition';


it('should render with the correct text', () => {
  const { getByText } = render(<BasicCompositionWraps />);
  const rendered = getByText('hello from CompositionWraps');
  expect(rendered).toBeTruthy();
});

