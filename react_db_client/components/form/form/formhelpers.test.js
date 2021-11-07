import { validateSubmit } from './formHelpers';

describe('Form Helpers', () => {
  it('Checks submit validity - fails if missing required field', () => {
    const validationData = validateSubmit(
      [
        { uid: 'a', required: true },
        { uid: 'b', rqeuired: false },
      ],
      {},
      {}
    );
    const { isValid, missingFields } = validationData;
    expect(isValid).not.toBeTruthy();
    expect(missingFields).toEqual(['a']);
  });
  it('Checks submit validity - passes', () => {
    const validationData = validateSubmit(
      [
        { uid: 'a', required: true },
        { uid: 'b', rqeuired: false },
      ],
      { a: 'foo' },
      {}
    );
    const { isValid } = validationData;
    expect(isValid).toBeTruthy();
  });
});
