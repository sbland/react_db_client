import React from 'react';
import { screen, render, within, waitFor } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import * as compositions from './file-manager.composition';
import { demoSearchResults } from './demo-data';

jest.mock('./demo-api', () => ({
  asyncFileUpload: jest.fn().mockImplementation(async () => {}),
}));

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
  describe('Importing new files', () => {
    test('should clear ready to upload list on upload success', async () => {
      render(<compositions.BasicFileManager />);
      await compositions.BasicFileManager.waitForReady();

      const selectFilesBtn = screen.getByLabelText('Select Files');
      const exampleFile: File = new File(['hello'], 'hello.png', { type: 'image/png' });
      await UserEvent.upload(selectFilesBtn, exampleFile);

      const selectedFilesList = screen
        .getAllByRole('list')
        .find((ul) => within(ul).queryByText(exampleFile.name)) as HTMLUListElement;
      expect(within(selectedFilesList).queryAllByRole('listitem').length).toEqual(1);

      const uploadBtn = screen.getByRole('button', { name: 'Upload' });
      await UserEvent.click(uploadBtn);

      expect(within(selectedFilesList).queryAllByRole('listitem').length).toEqual(0);

      const listsContainingItem = screen
        .getAllByRole('list')
        .filter((ul) => within(ul).queryByText(exampleFile.name)) as HTMLUListElement[];

      expect(within(selectedFilesList).queryByText(exampleFile.name)).not.toBeInTheDocument();
      expect(listsContainingItem.length).toEqual(1);
    });
    test('should be able to upload a new file', async () => {
      render(<compositions.BasicFileManager />);
      await compositions.BasicFileManager.waitForReady();

      const selectFilesBtn = screen.getByLabelText('Select Files');
      const exampleFile: File = new File(['hello'], 'hello.png', { type: 'image/png' });
      await UserEvent.upload(selectFilesBtn, exampleFile);

      const uploadBtn = screen.getByRole('button', { name: 'Upload' });
      await UserEvent.click(uploadBtn);

      const loadedFilesList = screen
        .getAllByRole('list')
        .find((c) => within(c).queryByText(demoSearchResults[0].name)) as HTMLUListElement;
      await within(loadedFilesList).findByText(exampleFile.name);
      const newItem = within(loadedFilesList)
        .getAllByRole('listitem')
        .find((el) => within(el).queryByText(exampleFile.name)) as HTMLUListElement;
      const newItemBtn = within(newItem).getByRole('button');
      await UserEvent.click(newItemBtn);
      await waitFor(() =>
        expect(screen.getByTestId('curSel').textContent).toEqual(exampleFile.name)
      );
      // TODO: Check that after successful upload it clears the ready to upload list
      // const readyToUploadList =
    });
    test('should be able to upload multiple files', async () => {
      render(<compositions.BasicFileManagerMultiple />);
      await compositions.BasicFileManager.waitForReady();

      const selectFilesBtn = screen.getByLabelText('Select Files');
      const exampleFileA: File = new File(['Foo'], 'foo.png', { type: 'image/png' });
      const exampleFileB: File = new File(['Bar'], 'bar.png', { type: 'image/png' });
      const exampleFiles = [exampleFileA, exampleFileB];
      await UserEvent.upload(selectFilesBtn, exampleFiles);
      const uploadBtn = screen.getByRole('button', { name: 'Upload' });
      await UserEvent.click(uploadBtn);

      const loadedFilesList = screen
        .getAllByRole('list')
        .find((c) => within(c).queryByText(demoSearchResults[0].name)) as HTMLUListElement;
      await within(loadedFilesList).findByText(exampleFileB.name);

      const newItemA = within(loadedFilesList)
        .getAllByRole('listitem')
        .find((el) => within(el).queryByText(exampleFileA.name)) as HTMLUListElement;
      const newItemBtnA = within(newItemA).getByRole('button');
      await UserEvent.click(newItemBtnA);

      const newItemB = within(loadedFilesList)
        .getAllByRole('listitem')
        .find((el) => within(el).queryByText(exampleFileB.name)) as HTMLUListElement;
      const newItemBtnB = within(newItemB).getByRole('button');
      await UserEvent.click(newItemBtnB);

      const acceptSelectionBtn = screen.getByRole('button', { name: /Accept Selection/ });
      await UserEvent.click(acceptSelectionBtn);

      await waitFor(() =>
        expect(screen.getByTestId('curSel').textContent).toEqual(
          `${exampleFileA.name},${exampleFileB.name}`
        )
      );
    });
    test.todo('should be able to select a file');
    test.todo('should be able to swap a file');
    test.todo('should be able to select multiple files');
  });
});
