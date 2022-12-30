import React from 'react';
import { screen, render, within } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';

import * as compositions from './file-manager.composition';
import { demoSearchResults } from './demo-data';

Date.now = jest.fn(() => 123); //14.02.2017

describe('file-manager', () => {
  let realWindow;
  const mockAlert = jest.fn();
  beforeEach(() => {
    /* Backup mocked globals */
    global.console.warn = jest.fn();
    window.alert = mockAlert;
  });

  afterEach(() => {
    // eslint-disable-next-line no-global-assign
    window = realWindow;
  });

  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, async () => {
        render(<Composition />);
        if (Composition.waitForReady) await Composition.waitForReady();
      });
    });
  });
  describe('Selecting existing files', () => {
    test('should return selection when selecting from existing files sas list', async () => {
      render(<compositions.BasicFileManager />);
      await compositions.BasicFileManager.waitForReady();
      const existingFilesList = screen
        .getAllByRole('list')
        .find((c) => within(c).queryByText(demoSearchResults[0].name));
      expect(existingFilesList).toBeInTheDocument();
      const existingFilesListItems = within(existingFilesList as HTMLUListElement).getAllByRole(
        'listitem'
      );
      expect(existingFilesListItems.length).toBeGreaterThan(0);
      const firstItem = within(existingFilesListItems[0]).getByRole('button');
      await UserEvent.click(firstItem);
      const curSel = screen.getByTestId('curSel');
      expect(curSel.textContent).toEqual(demoSearchResults[0].uid);
    });
  });
});
