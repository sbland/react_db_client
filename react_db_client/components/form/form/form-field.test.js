import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { FormField } from './FormField';
import { BasicFormField } from './form-field.composition';

const updateFormData = jest.fn();

const DemoFieldComponent = ({ uid, value, updateFormData }) => (
  <input
    role="presentation"
    type={'text'}
    value={value || ''}
    onChange={(e) => updateFormData(uid, e.target.value)}
  />
);

const defaultProps = {
  heading: { uid: 'id', type: 'text', label: 'Id' },
  value: 'abc',
  updateFormData,
  additionalData: {},
  componentMap: {
    text: () => DemoFieldComponent,
  },
};

describe('form-field', () => {
  describe('Renders', () => {
    it('renders', () => {
      shallow(<FormField {...defaultProps} />);
    });

    it('Matches Snapshot', () => {
      const component = shallow(<FormField {...defaultProps} />);
      const tree = component.debug();
      expect(tree).toMatchSnapshot();
    });
  });
  describe('Unit Tests', () => {
    let component;
    beforeEach(() => {
      component = mount(<FormField {...defaultProps} />);
    });
    describe('modifying input', () => {
      test('should modify input text on change', () => {
        const inputField = component.find('input');
        expect(inputField.props().value).toEqual(defaultProps.value);
      });
    });
  });
  describe('Compositions', () => {
    describe('BasicFormField', () => {
      let component;
      beforeEach(() => {
        component = mount(<BasicFormField />);
      });
      test('should be able to enter text into input', () => {
        const inputField = () => component.find('input');
        expect(inputField().props().value).toEqual('Hello world');
        expect(inputField().getDOMNode() !== document.activeElement);
        act(() => {
          inputField().simulate('focus');
        });
        expect(inputField().getDOMNode() === document.activeElement);
        act(() => {
          inputField().simulate('change', { target: { value: 'a' } });
        });
        component.update();
        expect(inputField().getDOMNode() === document.activeElement);
        expect(inputField().props().value).toEqual('a');
      });
    });
  });
});
