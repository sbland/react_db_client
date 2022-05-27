import '@samnbuk/react_db_client.testing.enzyme-setup';
import React from 'react';
import { shallow, mount } from 'enzyme';
import * as compositions from './field-date.composition';

const defaultProps = {
  //
};

describe('field date', () => {
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, () => {
        mount(<Composition />);
      });
    });
  });
});
