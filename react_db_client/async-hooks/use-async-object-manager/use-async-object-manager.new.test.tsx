import React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import * as compositions from './use-async-object-manager.composition';
import { demoDbData, demoLoadedData } from './demo-data';

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
      await screen.findAllByText(JSON.stringify(demoLoadedData));
    });
    test('should load data when clicking reload button', async () => {
      render(<compositions.AsyncTest />);
      const loadBtn = screen.getByRole('button', { name: /Reload data/ });
      await UserEvent.click(loadBtn);
      await screen.getByText('loading data');
      await screen.findByText('Loaded data');
      await screen.findAllByText(JSON.stringify(demoLoadedData));
    });
    test.todo('should show loading message');
  });
  describe('Updating doc', () => {
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
      const newData = { ...demoLoadedData, goodbye: newVal };
      await screen.findAllByText(JSON.stringify(newData));
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
      const newData = { ...demoLoadedData, goodbye: newVal };
      await screen.findAllByText(JSON.stringify(newData));
      const saveBtn = screen.getByRole('button', { name: /Save/ });
      await UserEvent.click(saveBtn);
      const expectedDbData = { ...demoDbData };
      expectedDbData.demoCollection.abc.goodbye = newVal;
      await waitFor(() =>
        expect(screen.getByTestId('dbData').textContent).toEqual(JSON.stringify(expectedDbData))
      );
      const dbData = screen.getByTestId('dbData').textContent;
      expect(dbData).toEqual(JSON.stringify(expectedDbData));
    });
    test.todo("should be able to update an array value");
    test.todo("should ")
  });
});
