import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Form } from './form';
import { demoHeadingsData, demoFormData } from './DemoData';
import { FormInputs } from './FormInputs';
import { defaultComponentMap } from './default-component-map';

const submitFunc = jest.fn();
const onChangeFunc = jest.fn();

// gets the number of rows
const rowCounter = (acc, val) => {
  let addme = 0;
  if (val.children) {
    addme = val.children.reduce(rowCounter, 0);
  } else {
    addme += 1;
  }
  return acc + addme;
};

const FormField = () => <div>FormFieldMock</div>;

const defaultProps = {
  headings: demoHeadingsData,
  formDataInitial: demoFormData,
  onSubmit: submitFunc,
  componentMap: defaultComponentMap,
  FormField,
};

describe('Form', () => {
  it('renders', () => {
    shallow(<Form {...defaultProps} />);
  });

  it('Matches Snapshot', () => {
    const component = shallow(<Form {...defaultProps} />);
    const tree = component.debug();
    expect(tree).toMatchSnapshot();
  });

  const form = mount(<Form {...defaultProps} />);

  it('renders a row for each heading', () => {
    expect(form.find(FormField).length).toEqual(demoHeadingsData.reduce(rowCounter, 0));
  });

  it('renders embedded headings as sections', () => {
    // expect(form.find())
  });

  it.skip('renders a submit button', () => {
    // Skipping as the submit button is now moved to a ref
    // TODO: May fail if more buttons on form
    expect(form.find('.submitBtn').props().type).toEqual('submit');
  });

  describe('submit', () => {
    it('calls on submit on submit button press', () => {
      const formDOM = form.find('.form');
      formDOM.simulate('submit');
      expect(submitFunc).toHaveBeenCalledTimes(1);
      expect(submitFunc).toHaveBeenCalledWith({
        formData: demoFormData,
        formEditData: {},
      });
    });

    it('Submits with new data when input changed and submit button pressed', () => {
      const formDOM = form.find('.form');
      // Disabled ids on form inputs to prevent autofill
      // const formInputDOM = form.find('input').filterWhere((n) => n.props().id === 'name');
      const formInputDOM = form.find('input').first();
      formInputDOM.simulate('change', { target: { value: 'foo' } });
      formDOM.simulate('submit');
      expect(submitFunc).toHaveBeenCalledTimes(2);
      expect(submitFunc).lastCalledWith({
        formData: { ...demoFormData, name: 'foo' },
        formEditData: { name: 'foo' },
      });
    });
  });

  describe('handleChange', () => {
    it('calls onChange func when a field is changed during live update', () => {
      const formLive = mount(<Form {...defaultProps} onChange={onChangeFunc} />);
      const formInputDOM = formLive
        .find('input')
        // Disabled ids on form inputs to prevent autofill
        // .filterWhere((n) => n.props().id === 'name')
        .first();
      formInputDOM.simulate('change', { target: { value: 'foo' } });
      expect(onChangeFunc).toHaveBeenCalledWith('name', 'foo', { name: 'foo' });
    });
  });
});

describe('FormInputs', () => {
  test.only('should update on change', () => {
    const mockUpdate = jest.fn();
    const formInputs = mount(
      <FormInputs {...defaultProps} updateFormData={mockUpdate} formData={{}} />
    );
    const formField = formInputs.find(FormField).first();

    act(() => {
      formField.props().updateFormData('name', 'foo');
    });
    expect(mockUpdate).toHaveBeenCalledWith('name', 'foo');
  });
});
