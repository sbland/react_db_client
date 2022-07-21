import React from 'react';

import { render } from '@samnbuk/react_db_client.testing.utils';

import * as compositions from './datatable-ui.composition';

describe('CardBoard', () => {
  Object.entries(compositions).forEach(([name, Composition]) => {
    if (name === 'default') return;
    describe(`${name} story`, () => {
      test('should render without errors', async () => {
        render(<Composition />);
      });
    });
  });
});
