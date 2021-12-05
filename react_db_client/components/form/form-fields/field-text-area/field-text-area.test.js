import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
import { mount, shallow } from 'enzyme';

import { FieldTextArea } from "./field-text-area";
import * as compositions from './field-text-area.composition';
import { defaultVal } from './demo-data';

const updateFormData = jest.fn();

const defaultProps = {
  uid: 'uid',
  unit: 'unit',
  value: defaultVal,
  updateFormData,
};


describe('field-text-area', () => {
  beforeEach(() => {
    updateFormData.mockClear();
  });
  test('Renders', () => {
    shallow(<FieldTextArea {...defaultProps} />);
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
      const component = shallow(<FieldTextArea {...defaultProps} />);
      const tree = component.debug();
      expect(tree).toMatchSnapshot();
    });
  });
});

