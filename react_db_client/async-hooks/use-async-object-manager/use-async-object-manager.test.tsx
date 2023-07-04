import React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import cloneDeep from 'lodash/cloneDeep';
import * as compositions from './use-async-object-manager.composition';
import { demoDbData, demoLoadedData, inputAdditionalData } from './demo-data';
import { JSONStringifySorted } from './test-utils';

describe('Use async request hook', () => {
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, async () => {
        render(<Composition />);
        // @ts-ignore
        if (Composition.waitForReady) await Composition.waitForReady();
      });
    });
  });
  describe('loading data', () => {
    test('should load data and show in composition', async () => {
      render(<compositions.AsyncTestLoadOnInit />);
      await screen.getByText('loading data');
      await screen.findByText('Loaded data');
      await screen.findAllByText(JSONStringifySorted(demoLoadedData));
    });
    test('should load data when clicking reload button', async () => {
      render(<compositions.AsyncTest />);
      const loadBtn = screen.getByRole('button', { name: /Reload data/ });
      await UserEvent.click(loadBtn);
      await screen.getByText('loading data');
      await screen.findByText('Loaded data');
      await screen.findAllByText(JSONStringifySorted(demoLoadedData));
    });
    test('should increase call count clicking reload button', async () => {
      render(<compositions.AsyncTest />);

      expect(
        parseInt(screen.getByTestId('callcount').textContent || '0')
      ).toEqual(0);
      const loadBtn = screen.getByRole('button', { name: /Reload data/ });
      await UserEvent.click(loadBtn);
      await screen.getByText('loading data');
      await screen.findByText('Loaded data');
      await screen.findAllByText(JSONStringifySorted(demoLoadedData));

      expect(
        parseInt(screen.getByTestId('callcount').textContent || '0')
      ).toEqual(1);
    });

    test('should be able to reload the doc', async () => {
      render(<compositions.AsyncTestLoadOnInit />);
      expect(
        parseInt(screen.getByTestId('callcount').textContent || '0')
      ).toEqual(1);
      const loadBtn = screen.getByRole('button', { name: /Reload data/ });
      await screen.getByText('loading data');
      await screen.findByText('Loaded data');
      await screen.findAllByText(JSONStringifySorted(demoLoadedData));
      const dbOverrideInput: HTMLInputElement =
        screen.getByLabelText('Goodbye Input Db');
      await UserEvent.click(dbOverrideInput);
      await UserEvent.clear(dbOverrideInput);
      await waitFor(() => expect(dbOverrideInput.value).toEqual(''));
      const altValue = '1';
      await UserEvent.keyboard(altValue);
      await waitFor(() =>
        expect(
          parseInt(screen.getByTestId('callcount').textContent || '0')
        ).toEqual(2)
      );
      expect(
        screen.queryByText(`"${altValue}"`, { exact: false })
      ).not.toBeInTheDocument();
      await UserEvent.click(loadBtn);
      await waitFor(() =>
        expect(
          parseInt(screen.getByTestId('callcount').textContent || '0')
        ).toEqual(3)
      );
      await screen.findByText(`"${altValue}"`, { exact: false });
      await waitFor(() =>
        expect(screen.getByTestId('loadedData').textContent).toContain(altValue)
      );
      expect(screen.getByTestId('loadedData').textContent).toContain(altValue);
    });
    test.todo('should show loading message');
  });
  describe('Creating a new document', () => {
    test('should be able to save a new document', async () => {
      render(<compositions.AsyncTestNewObject />);
      await compositions.AsyncTest.waitForReady();
      const formInputEl = screen.getByLabelText('Goodbye Input');
      await UserEvent.clear(formInputEl);
      const newVal = 'New Value';
      await UserEvent.type(formInputEl, newVal);
      const newData = {
        ...inputAdditionalData,
        goodbye: newVal,
        uid: expect.any(String),
      };
      await waitFor(() =>
        expect(screen.getByTestId('data').textContent).toContain(newVal)
      );
      const newDataRead = JSON.parse(
        screen.getByTestId('data').textContent || '{}'
      );
      expect(newDataRead).toEqual(newData);
      const dbData = screen.getByTestId('dbData').textContent;
      expect(dbData).toEqual(JSON.stringify(demoDbData));
    });
    test('should automatically save a new doc if autoSaveNew is true', async () => {
      render(<compositions.AsyncTestAutoSaveNew />);
      await compositions.AsyncTest.waitForReady();
      await waitFor(() =>
        expect(screen.getByTestId('dbData').textContent).toContain(
          inputAdditionalData.injectedProp
        )
      );
      const newDataRead = JSON.parse(
        screen.getByTestId('dbData').textContent || '{}'
      );
      expect(Object.values(newDataRead.demoCollection).length).toEqual(2);
    });
    test('should not automatically save a new doc if autoSaveNew is false', async () => {
      render(<compositions.AsyncTestNewObject />);
      await compositions.AsyncTest.waitForReady();
      const newDataRead = JSON.parse(
        screen.getByTestId('dbData').textContent || '{}'
      );
      expect(Object.values(newDataRead.demoCollection).length).toEqual(1);
    });
  });
  describe('Updating doc', () => {
    test('should call save callback on successful submit', async () => {
      render(<compositions.AsyncTest />);
      await compositions.AsyncTest.waitForReady();
      const loadBtn = screen.getByRole('button', { name: /Reload data/ });
      await UserEvent.click(loadBtn);
      await screen.findByText('Loaded data');
      const formInputEl = screen.getByLabelText('Goodbye Input');
      await UserEvent.clear(formInputEl);
      const newVal = 'New Value';
      await UserEvent.type(formInputEl, newVal);
      const newData = {
        ...demoLoadedData,
        ...inputAdditionalData,
        goodbye: newVal,
      };
      const saveBtn = screen.getByRole('button', { name: /Save/ });
      await UserEvent.click(saveBtn);
      const savedCallbackResponse = await screen.findByTestId(
        'onSavedCallbackResponse'
      );
      expect(JSON.parse(savedCallbackResponse.textContent || '{}')).toEqual([
        demoLoadedData.uid,
        { ok: true },
        newData,
      ]);
    });
    test('should not call save callback on failed submit', async () => {
      const okVal = 'OK';
      const invalidVal = 'ERROR';

      render(<compositions.AsyncTest />);
      await compositions.AsyncTest.waitForReady();
      const loadBtn = screen.getByRole('button', { name: /Reload data/ });
      await UserEvent.click(loadBtn);
      await screen.findByText('Loaded data');
      const saveBtn = screen.getByRole('button', { name: /Save/ });

      const formInputEl = screen.getByLabelText('Goodbye Input');
      await UserEvent.clear(formInputEl);
      await UserEvent.type(formInputEl, invalidVal);
      await UserEvent.click(saveBtn);

      const errorCallbackResponse = await screen.findByTestId(
        'saveErrorCallbackResponse'
      );
      expect(errorCallbackResponse.textContent).toEqual(
        'You asked for an error?'
      );

      expect(
        screen.queryByTestId('onSavedCallbackResponse')
      ).not.toBeInTheDocument();

      await UserEvent.clear(formInputEl);
      await UserEvent.type(formInputEl, okVal);
      await UserEvent.click(saveBtn);
      await screen.findByTestId('onSavedCallbackResponse');
      expect(
        screen.queryByText('You asked for an error?')
      ).not.toBeInTheDocument();

      await UserEvent.clear(formInputEl);
      await UserEvent.type(formInputEl, invalidVal);
      await UserEvent.click(saveBtn);
      await screen.findByText('You asked for an error?');

      expect(
        screen.queryByTestId('onSavedCallbackResponse')
      ).not.toBeInTheDocument();
    });

    test('should change local data when editing input', async () => {
      render(<compositions.AsyncTest />);
      await compositions.AsyncTest.waitForReady();
      const loadBtn = screen.getByRole('button', { name: /Reload data/ });
      await UserEvent.click(loadBtn);
      await screen.findByText('Loaded data');
      const formInputEl = screen.getByLabelText('Goodbye Input');
      await UserEvent.clear(formInputEl);
      const newVal = 'New Value';
      await UserEvent.type(formInputEl, newVal);
      const newData = {
        ...demoLoadedData,
        ...inputAdditionalData,
        goodbye: newVal,
      };
      await screen.findAllByText(JSONStringifySorted(newData));
      const dbData = screen.getByTestId('dbData').textContent;
      expect(dbData).toEqual(JSON.stringify(demoDbData));
    });
    test('should change database data when editing input and saving', async () => {
      render(<compositions.AsyncTestLoadOnInit />);
      await compositions.AsyncTestLoadOnInit.waitForReady();
      const formInputEl = screen.getByLabelText('Goodbye Input');
      await UserEvent.clear(formInputEl);
      const newVal = 'New Value';
      await UserEvent.type(formInputEl, newVal);
      const newData = {
        ...demoLoadedData,
        ...inputAdditionalData,
        goodbye: newVal,
      };
      await screen.findAllByText(JSONStringifySorted(newData));
      const saveBtn = screen.getByRole('button', { name: /Save/ });
      await UserEvent.click(saveBtn);
      const expectedDbData = { ...demoDbData };
      expectedDbData.demoCollection.abc = {
        ...expectedDbData.demoCollection.abc,
        ...inputAdditionalData,
        goodbye: newVal,
      };
      await waitFor(() =>
        expect(screen.getByTestId('dbData').textContent).toEqual(
          JSON.stringify(expectedDbData)
        )
      );
      const dbData = screen.getByTestId('dbData').textContent;
      expect(dbData).toEqual(JSON.stringify(expectedDbData));
    });
    test('should change database data when editing input and saving', async () => {
      render(<compositions.AsyncTestLoadOnInit />);
      await compositions.AsyncTestLoadOnInit.waitForReady();
      const formInputEl = screen.getByLabelText('Goodbye Input');
      await UserEvent.clear(formInputEl);
      const newVal = 'New Value';
      await UserEvent.type(formInputEl, newVal);
      const newData = {
        ...demoLoadedData,
        ...inputAdditionalData,
        goodbye: newVal,
      };
      await screen.findAllByText(JSONStringifySorted(newData));
      const saveBtn = screen.getByRole('button', { name: /Save/ });
      await UserEvent.click(saveBtn);
      const expectedDbData = { ...demoDbData };
      expectedDbData.demoCollection.abc = {
        ...expectedDbData.demoCollection.abc,
        ...inputAdditionalData,
        goodbye: newVal,
      };
      await waitFor(() =>
        expect(screen.getByTestId('dbData').textContent).toEqual(
          JSON.stringify(expectedDbData)
        )
      );
      const dbData = screen.getByTestId('dbData').textContent;
      expect(dbData).toEqual(JSON.stringify(expectedDbData));
    });

    test('should save data when saveAllOnSave is true', async () => {
      // TODO: This is difficult to test with current test setup
      // render(<compositions.AsyncTestSaveAll />);
      // await compositions.AsyncTestLoadOnInit.waitForReady();
      // const formInputEl = screen.getByLabelText('Goodbye Input');
      // await UserEvent.clear(formInputEl);
      // const newVal = 'New Value';
      // await UserEvent.type(formInputEl, newVal);
      // const newData = {
      //   ...demoLoadedData,
      //   ...inputAdditionalData,
      //   goodbye: newVal,
      // };
      // await screen.findAllByText(JSONStringifySorted(newData));
      // const saveBtn = screen.getByRole('button', { name: /Save/ });
      // await UserEvent.click(saveBtn);
      // const expectedDbData = { ...demoDbData };
      // expectedDbData.demoCollection.abc = {
      //   ...expectedDbData.demoCollection.abc,
      //   ...inputAdditionalData,
      //   goodbye: newVal,
      // };
      // await waitFor(() =>
      //   expect(screen.getByTestId('dbData').textContent).toEqual(
      //     JSON.stringify(expectedDbData)
      //   )
      // );
      // const dbData = screen.getByTestId('dbData').textContent;
      // expect(dbData).toEqual(JSON.stringify(expectedDbData));
    });
    test.todo('should be able to update an array value');
    test('should handle errors when saving', async () => {
      render(<compositions.AsyncTestLoadOnInit />);
      await compositions.AsyncTestLoadOnInit.waitForReady();
      const formInputEl = screen.getByLabelText('Goodbye Input');
      await UserEvent.clear(formInputEl);
      const newVal = 'ERROR'; // The mock post function will pick this up and throw an error
      await UserEvent.type(formInputEl, newVal);
      const newData = {
        ...demoLoadedData,
        ...inputAdditionalData,
        goodbye: newVal,
      };
      await screen.findAllByText(JSONStringifySorted(newData));
      const saveBtn = screen.getByRole('button', { name: /Save/ });
      await UserEvent.click(saveBtn);
      const expectedDbData = cloneDeep(demoDbData);
      expectedDbData.demoCollection.abc = {
        ...expectedDbData.demoCollection.abc,
        ...inputAdditionalData,
        goodbye: newVal,
      };
      await waitFor(() =>
        expect(screen.getByTestId('saveError').textContent).toEqual(
          'You asked for an error?'
        )
      );
      const dbData = screen.getByTestId('dbData').textContent;
      expect(dbData).toEqual(JSON.stringify(demoDbData));
    });
  });
});
