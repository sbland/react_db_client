import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
import { mount, shallow } from 'enzyme';

import { FieldFile } from "./field-file";
import * as compositions from './field-file.composition';
import { defaultVal } from './demo-data';

const updateFormData = jest.fn();

const defaultProps = {
  uid: 'uid',
  unit: 'unit',
  value: defaultVal,
  updateFormData,
};


describe('field-file', () => {
  beforeEach(() => {
    updateFormData.mockClear();
  });
  test('Renders', () => {
    shallow(<FieldFile {...defaultProps} />);
  });

  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, () => {
        mount(<Composition />);
      });
    });
  });
  describe('shallow renders', () => {
    test('Matches Snapshot', () => {
      const component = shallow(<FieldFile {...defaultProps} />);
      const tree = component.debug();
      expect(tree).toMatchSnapshot();
    });
  });
});

