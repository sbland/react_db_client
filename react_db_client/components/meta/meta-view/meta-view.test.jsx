import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';

import { mount } from 'enzyme';

import * as compositions from './meta-view.composition';
import { defaultProps } from './demo-data';

describe('Meta View', () => {
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, () => {
        mount(<Composition />);
      });
    });
  });
});
