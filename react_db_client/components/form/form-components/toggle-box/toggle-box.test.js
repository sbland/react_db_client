import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { BasicToggleBox } from './toggle-box.composition';
import * as compositions from './toggle-box.composition';

const defaultProps = {
  //
};

describe('toggle box', () => {
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, () => {
        mount(<Composition />);
      });
    });
  });
});
