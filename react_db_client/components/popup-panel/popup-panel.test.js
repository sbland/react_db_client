import '@samnbuk/react_db_client.testing.enzyme-setup';
import React from 'react';
import { shallow, mount } from 'enzyme';
import * as compositions from './popup-panel.composition';

const defaultProps = {
  //
};

describe('popup panel', () => {
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, () => {
        const component = mount(<Composition />);
        expect(component.debug()).toMatchSnapshot();
      });
    });
  });
});
