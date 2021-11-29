/* eslint-disable camelcase */
import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
import { mount } from 'enzyme';
import { AsyncTest1, AsyncTest2 } from './use-async-object-manager.composition';
import { act } from 'react-dom/test-utils';

describe('useAsyncObjectManager', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  describe('Compositions', () => {
    test('should render asyncTest1', () => {
      act(() => {
        mount(<AsyncTest1 />);
      });
      act(() => {
        jest.runOnlyPendingTimers();
      });
    });
    /* TODO: Fix this test as having async issues */
    test.skip('should render asyncTest2', () => {
      act(() => {
        mount(<AsyncTest2 />);
      });
      act(() => {
        jest.runOnlyPendingTimers();
      });
    });
  });
});
