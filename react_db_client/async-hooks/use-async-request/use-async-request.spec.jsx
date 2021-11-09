import React from 'react';
import { render } from '@testing-library/react';
import { BasicUseAsyncRequest } from './use-async-request.composition';


it('should render with the correct text', () => {
  const { getByText } = render(<BasicUseAsyncRequest />);
  const rendered = getByText('hello from UseAsyncRequest');
  expect(rendered).toBeTruthy();
});

