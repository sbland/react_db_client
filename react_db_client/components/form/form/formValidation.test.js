import formValidation from './formValidation';
import { demoHeadingsData, demoFormData } from './DemoData';
import { filterTypes } from '@samnbuk/react_db_client.constants.client-types';

describe('Form Validation', () => {
  test('should pass on valid form data', () => {
    expect(formValidation(demoFormData, demoHeadingsData)).toBeTruthy();
  });
  test('should fail when data missing required fields', () => {
    const headings = [
      ...demoHeadingsData,
      { uid: 'newField', type: filterTypes.text, required: true },
    ];
    expect(formValidation(demoFormData, headings)).toEqual({
      error: 'Missing the following fields: newField',
      fields: ['newField'],
    });
  });
});
