import React from 'react';
import { mount, shallow } from 'enzyme';
import { MockReactC } from '../../Helpers/testing';

import FormInputs from './FormInputs';
import { demoHeadingsData, demoFormData } from './DemoData';
import FormField from './FormField';

jest.mock('./FormField', () => MockReactC('FormField'));

const updateFormData = jest.fn();

const defaultProps = {
  headings: demoHeadingsData,
  formData: demoFormData,
  updateFormData,
  additionalData: {},
};

describe('FormInputs', () => {
  beforeEach(() => {});
  test('Renders', () => {
    shallow(<FormInputs {...defaultProps} />);
  });
  describe('shallow renders', () => {
    test('Matches Snapshot', () => {
      const component = shallow(<FormInputs {...defaultProps} />);
      const tree = component.debug();
      expect(tree).toMatchSnapshot();
    });
  });
  describe('Unit tests', () => {
    let component;
    beforeEach(() => {
      component = mount(<FormInputs {...defaultProps} />);
    });
    test('should call updateformData when an input changes', () => {
      const input = component.find(FormField).first();
      const field = 'demofield';
      const value = 'demovalue';
      input.props().updateFormData(field, value);
      expect(updateFormData).toHaveBeenCalledWith(field, value);
    });
    test('should create the correct number of fields', () => {
      const fields = component.find(FormField);
      // Add 2 to length as we have embedded headings
      expect(fields.length).toEqual(demoHeadingsData.length + 2);
    });
  });
});
