import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
import { mount, shallow } from 'enzyme';

import { FieldSelect } from "./field-select";
import * as compositions from './field-select.composition';
import { defaultVal, demoOptions } from './demo-data';

const updateFormData = jest.fn();

const defaultProps = {
  uid: 'uid',
  unit: 'unit',
  value: defaultVal,
  options: demoOptions,
  updateFormData,
};

describe('Field Select', () => {
    beforeEach(() => {
        updateFormData.mockClear();
      });
      test('Renders', () => {
    shallow(<FieldSelect {...defaultProps} />);
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
      const component = shallow(<FieldSelect {...defaultProps} />);
      const tree = component.debug();
      expect(tree).toMatchSnapshot();
    });
  });
});
