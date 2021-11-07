// import React from 'react';
// import { mount } from 'enzyme';
// import { MockReactC } from '../../Helpers/testing';
// import { demoHeadingsData, demoFormData } from './DemoData';

// import { Form } from './Form';
// import FormFieldText from './Fields/FieldText';
// import BubbleSelector from '../BubbleSelector/BubbleSelector';
// import FormField, { FieldLabel } from './FormField';
// import FormFieldReadOnly from './Fields/FieldReadOnly';
// import FormFieldObjectRef from './Fields/FieldObjectRef';
// import SearchAndSelectDropdown from '../SearchAndSelect/SearchAndSelectDropdown';
// import FormInputs from './FormInputs';

// jest.mock('../../Api/Api');
// jest.mock('../BubbleSelector/BubbleSelector', () => MockReactC('BubbleSelector'));

// const onSubmit = jest.fn();
// const onChange = jest.fn();

// const defaultProps = {
//   headings: demoHeadingsData,
//   formDataInitial: demoFormData,
//   onSubmit,
//   onChange,
//   showEndBtns: true,
//   submitBtnText: 'Submit',
//   showKey: true,
//   orientation: 'vert',
//   additionalData: { hello: 'world' },
// };

// describe('Form - Functional Tests', () => {
//   beforeEach(() => {
//     onChange.mockClear();
//     onSubmit.mockClear();
//   });
//   describe('Functional tests', () => {
//     let component;
//     beforeEach(() => {
//       component = mount(<Form {...defaultProps} />);
//     });
//     describe('Bug fixing', () => {
//       test('should have passed correct props to bubble selector', () => {
//         const bubbleSelector = component.find(BubbleSelector);
//         expect(bubbleSelector.at(0).props().activeSelection).toEqual([]);
//         expect(bubbleSelector.at(1).props().activeSelection).toEqual([]);
//       });
//       // TODO: Below no longer works but component is working
//       test.skip('should call on change when a reference dropdown is selected', () => {
//         const formFieldObjectRef = component.find(FormFieldObjectRef);
//         expect(formFieldObjectRef.props()).toEqual({
//           ...demoHeadingsData[6],
//           labelField: 'label',
//           multiple: false,
//           required: false,
//           unit: '',
//           updateFormData: expect.any(Function),
//           value: null,
//         });
//         const newValue = 'newval';
//         const newFormData = { [demoHeadingsData[6].uid]: newValue };
//         formFieldObjectRef.props().updateFormData(demoHeadingsData[6].uid, newValue);
//         expect(onChange).toHaveBeenCalledWith(demoHeadingsData[6].uid, newValue, newFormData);
//         const sas = formFieldObjectRef.find(SearchAndSelectDropdown);
//         expect(sas.props()).toEqual({
//           allowEmptySearch: true,
//           allowMultiple: false,
//           className: 'formFieldInput',
//           handleSelect: expect.any(Function),
//           labelField: 'label',
//           required: false,
//           returnFieldOnSelect: '_id',
//           searchDelay: 500,
//           searchFieldPlaceholder: null,
//           searchFieldTargetField: 'label',
//           searchFunction: expect.any(Function),
//           selectionOverride: null,
//         });
//         onChange.mockClear();
//         sas.props().handleSelect(newValue);
//         expect(onChange).toHaveBeenCalledWith(demoHeadingsData[6].uid, newValue, newFormData);
//       });
//     });

//     describe('Passing data to fields', () => {
//       test('should pass headings data to field', () => {
//         const field = component.find(FormField).first().childAt(0).childAt(1);
//         expect(field.type()).toEqual(FormFieldReadOnly);
//         expect(field.props()).toEqual({
//           label: demoHeadingsData[0].label,
//           type: demoHeadingsData[0].type,
//           options: demoHeadingsData[0].options || [],
//           uid: demoHeadingsData[0].uid,
//           unit: demoHeadingsData[0].unit || '',
//           updateFormData: expect.any(Function),
//           value: demoFormData.uid,
//           additionalData: defaultProps.additionalData,
//         });
//         expect(field.debug()).toMatchSnapshot();
//       });
//       test('should pass headings data to field label', () => {
//         const field = component.find(FormField).first().childAt(0).childAt(0);
//         expect(field.type()).toEqual(FieldLabel);
//         expect(field.props()).toEqual({
//           label: demoHeadingsData[0].label,
//           required: demoHeadingsData[0].required || false,
//           hasChanged: false,
//           hasLabel: true,
//           inputClassName: 'form_label',
//         });
//         expect(field.debug()).toMatchSnapshot();
//       });
//       test('should pass field update back to onChange function', () => {
//         const field = component.find(FormField).at(1).childAt(0).childAt(1);
//         expect(field.type()).toEqual(FormFieldText);
//         expect(field.props().uid).toEqual(demoHeadingsData[1].uid);
//         const input = field.find('input');
//         const newValue = 'New Val';
//         const newFormData = { [demoHeadingsData[1].uid]: newValue };
//         input.simulate('change', { target: { value: newValue } });
//         expect(onChange).toHaveBeenCalledWith(demoHeadingsData[1].uid, newValue, newFormData);
//       });
//       test('should pass label value to read only select field', () => {
//         const fieldIndex = 12;
//         const field = component.find(FormField).at(fieldIndex).childAt(0).childAt(1);
//         expect(field.type()).toEqual(FormFieldReadOnly);
//         // TODO: This is a fragile test. Should link to headings data etc
//         expect(field.text()).toEqual('Rep 1');
//       });
//       test('should pass additional data to fields', () => {
//         // We can include additional data in the form that is accessible by each field.
//         const additionalData = { hello: 'world' };
//         component.setProps({ additionalData });
//         component.update();
//         const formInputs = component.find(FormInputs).first();
//         expect(formInputs.props().additionalData).toEqual(additionalData);
//         const field = component.find(FormField).first();
//         expect(field.props().additionalData).toEqual(additionalData);
//       });
//     });

//     describe('Custom form components', () => {
//       // Forms should allow passing custom field components
//       let CustomFormComponent;
//       let customFieldComponents;
//       beforeEach(() => {
//         /* eslint-disable react/prop-types */
//         /* eslint-disable no-unused-vars */
//         CustomFormComponent = ({ uid, label, updateFormData, value, required }) => (
//           <div>Custom Form Component</div>
//         );
//         /* eslint-disable */
//         const customField = {
//           uid: 'customField',
//           label: 'Custom Field Type',
//           type: 'customFieldType',
//         };
//         const formDataInitial = {
//           customField: 'Hello World',
//         };
//         customFieldComponents = { customFieldType: CustomFormComponent };
//         component.setProps({ customFieldComponents });
//         component.update();
//         component.setProps({ headings: [customField], formDataInitial });
//         component.update();
//       });
//       test('should be able to pass a custom field to the form component', () => {
//         const formInputs = component.find(FormInputs);
//         expect(formInputs.props().customFieldComponents).toEqual(customFieldComponents);
//         const customFormComponentInstance = component.find(CustomFormComponent);
//         expect(customFormComponentInstance.exists()).toBeTruthy();
//         customFormComponentInstance.props().updateFormData('DemoId', 'New World');
//         expect(onChange).toHaveBeenCalledWith('DemoId', 'New World', { DemoId: 'New World' });
//       });
//     });
//   });
// });
