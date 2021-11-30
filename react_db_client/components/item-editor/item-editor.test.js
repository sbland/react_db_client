/* eslint-disable camelcase */
import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
import { mount } from 'enzyme';
import { BasicItemEditor } from './item-editor.composition';
import { act } from 'react-dom/test-utils';

// const asyncGetDocument = jest.fn().mockImplementation(async () => loadedData);
// const asyncPutDocument = jest.fn().mockImplementation(async () => ({ ok: true }));
// const asyncPostDocument = jest.fn().mockImplementation(async () => ({ ok: true }));
// const asyncDeleteDocument = jest.fn().mockImplementation(async () => ({ ok: true }));
// const onSavedCallback = jest.fn();

const defaultArgs = {
  //
};

describe('BasicItemEditor', () => {
  beforeAll(() => {
    // jest.useFakeTimers();
  });

  afterAll(() => {
    // jest.useRealTimers();
  });

  describe('Compositions', () => {
    test('should render BasicItemEditor', async () => {
      let component;
      act(() => {
        component = mount(<BasicItemEditor />);
      });
      await act(async () => {
        component.update();
        await new Promise((resolve) => setTimeout(resolve));
      });
    });
  });
});
