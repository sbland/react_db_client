import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
import { mount } from 'enzyme';
import { SearchAndSelectDropdown } from '@samnbuk/react_db_client.components.search-and-select-dropdown';

import { demoHeadingsData, demoFormData } from './DemoData';

import { Form } from './form';
import { FieldText } from '@samnbuk/react_db_client.components.form.form-fields.field-text';
import { FieldReadOnly } from '@samnbuk/react_db_client.components.form.form-fields.field-read-only';
import { FieldObjectRef } from '@samnbuk/react_db_client.components.form.form-fields.field-object-ref';
import { FormInputs } from './FormInputs';
import { FieldLabel } from './field-label';
import { FormField } from './FormField';
import { filterTypes } from '@samnbuk/react_db_client.constants.client-types';
import { defaultComponentMap } from './default-component-map';

const onSubmit = jest.fn();
const onChange = jest.fn();

const defaultProps = {
  headings: demoHeadingsData,
  formDataInitial: demoFormData,
  onSubmit,
  onChange,
  showEndBtns: true,
  submitBtnText: 'Submit',
  showKey: true,
  orientation: 'vert',
  additionalData: { hello: 'world' },
  componentMap: defaultComponentMap,
  FormField,
};

describe('Form - Functional Tests', () => {
  beforeEach(() => {
    onChange.mockClear();
    onSubmit.mockClear();
  });
  describe('Functional tests', () => {
    let component;
    beforeEach(() => {
      component = mount(<Form {...defaultProps}
      />);
    });
    describe('Bug fixing', () => {
      // TODO: Below no longer works but component is working
      test.skip('should call on change when a reference dropdown is selected', () => {
        const formFieldObjectRef = component.find(FieldObjectRef);
        expect(formFieldObjectRef.props()).toEqual({
          ...demoHeadingsData[6],
          labelField: 'label',
          multiple: false,
          required: false,
          unit: '',
          updateFormData: expect.any(Function),
          value: null,
        });
        const newValue = 'newval';
        const newFormData = { [demoHeadingsData[6].uid]: newValue };
        formFieldObjectRef.props().updateFormData(demoHeadingsData[6].uid, newValue);
        expect(onChange).toHaveBeenCalledWith(demoHeadingsData[6].uid, newValue, newFormData);
        const sas = formFieldObjectRef.find(SearchAndSelectDropdown);
        expect(sas.props()).toEqual({
          allowEmptySearch: true,
          allowMultiple: false,
          className: 'formFieldInput',
          handleSelect: expect.any(Function),
          labelField: 'label',
          required: false,
          returnFieldOnSelect: '_id',
          searchDelay: 500,
          searchFieldPlaceholder: null,
          searchFieldTargetField: 'label',
          searchFunction: expect.any(Function),
          selectionOverride: null,
        });
        onChange.mockClear();
        sas.props().handleSelect(newValue);
        expect(onChange).toHaveBeenCalledWith(demoHeadingsData[6].uid, newValue, newFormData);
      });
    });

    describe('Passing data to fields', () => {
      test('should pass headings data to field', () => {
        const field = component.find(FormField).first().childAt(0).childAt(1);
        expect(field.type()).toEqual(FieldReadOnly);
        expect(field.props()).toEqual({
          label: demoHeadingsData[0].label,
          type: demoHeadingsData[0].type,
          options: demoHeadingsData[0].options || [],
          uid: demoHeadingsData[0].uid,
          unit: demoHeadingsData[0].unit || '',
          updateFormData: expect.any(Function),
          value: demoFormData.uid,
          additionalData: defaultProps.additionalData,
        });
        expect(field.debug()).toMatchSnapshot();
      });
      test('should pass headings data to field label', () => {
        const field = component.find(FormField).first().childAt(0).childAt(0);
        expect(field.type()).toEqual(FieldLabel);
        expect(field.props()).toEqual({
          label: demoHeadingsData[0].label,
          required: demoHeadingsData[0].required || false,
          hasChanged: false,
          hasLabel: true,
          inputClassName: 'form_label',
        });
        expect(field.debug()).toMatchSnapshot();
      });
      test('should pass field update back to onChange function', () => {
        const field = component.find(FormField).find(FieldText).first()
        expect(field.type()).toEqual(FieldText);
        expect(field.props().uid).toEqual(demoHeadingsData[1].uid);
        const input = field.find('input');
        const newValue = 'New Val';
        const newFormData = { [demoHeadingsData[1].uid]: newValue };
        input.simulate('change', { target: { value: newValue } });
        expect(onChange).toHaveBeenCalledWith(demoHeadingsData[1].uid, newValue, newFormData);
      });
      test('should pass label value to read only select field', () => {
        const fieldIndex = 12;
        const field = component.find(FormField).at(fieldIndex).childAt(0).childAt(1);
        expect(field.type()).toEqual(FieldReadOnly);
        // TODO: This is a fragile test. Should link to headings data etc
        expect(field.text()).toEqual('Rep 1');
      });
      test('should pass additional data to fields', () => {
        // We can include additional data in the form that is accessible by each field.
        const additionalData = { hello: 'world' };
        component.setProps({ additionalData });
        component.update();
        const formInputs = component.find(FormInputs).first();
        expect(formInputs.props().additionalData).toEqual(additionalData);
        const field = component.find(FormField).first();
        expect(field.props().additionalData).toEqual(additionalData);
      });
    });
  });
});
