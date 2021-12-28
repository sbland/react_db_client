import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import * as compositions from './meta-view-manager.composition';

/* Tests */
describe('Meta View Manager', () => {
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, async () => {
        let component;
        act(() => {
          component = mount(<Composition />);
        });
        await act(async () => {
          component.update();
          await new Promise((resolve) => setTimeout(resolve));
        });
      });
    });
  });
});
