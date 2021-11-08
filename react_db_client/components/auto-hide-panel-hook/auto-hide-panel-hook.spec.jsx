import React from 'react';
import { render } from '@testing-library/react';
import { BasicAutoHidePanelHook } from './auto-hide-panel-hook.composition';


it('should render with the correct text', () => {
  const { getByText } = render(<BasicAutoHidePanelHook />);
  const rendered = getByText('hello from AutoHidePanelHook');
  expect(rendered).toBeTruthy();
});

