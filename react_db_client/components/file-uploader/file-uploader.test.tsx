import React from 'react';
import { screen, render, within, act, waitFor } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import * as compositions from './file-uploader.composition';
import { onUpload, asyncFileUpload } from './dummy-data';

jest.mock('./dummy-data', () => ({
  asyncFileUpload: jest.fn(),
  onUpload: jest.fn(),
}));

beforeEach(() => {
  (asyncFileUpload as jest.Mock).mockClear().mockImplementation(async () => {});
  (onUpload as jest.Mock).mockClear();
});

describe('File uploader', () => {
  describe('Compositions', () => {
    Object.entries(compositions)
      .filter(([name, Composition]) => (Composition as any).forTests)
      .forEach(([name, Composition]) => {
        test(name, async () => {
          render(<Composition />);
          // @ts-ignore
          if (Composition.waitForReady) await Composition.waitForReady();
        });
      });
  });
  describe('File Upload', () => {
    test('should add files to selected on click', async () => {
      render(<compositions.BasicFileUploader />);
      const selectFilesBtn = screen.getByLabelText('Select Files');
      const exampleFile: File = new File(['hello'], 'hello.png', {
        type: 'image/png',
      });
      await UserEvent.upload(selectFilesBtn, exampleFile);
      const selectedFilesList = screen.getByRole('list');
      const selectedFiles = within(selectedFilesList).getAllByRole('listitem');
      expect(selectedFiles.length).toEqual(1);
    });
    test('should call asyncFileUpload with file data', async () => {
      render(<compositions.BasicFileUploader />);
      const selectFilesBtn = screen.getByLabelText('Select Files');
      const exampleFile: File = new File(['hello'], 'hello.png', {
        type: 'image/png',
      });
      await UserEvent.upload(selectFilesBtn, exampleFile);
      const uploadBtn = screen.getByRole('button', { name: 'Upload' });
      await UserEvent.click(uploadBtn);
      await waitFor(() => expect(asyncFileUpload).toHaveBeenCalled());
      expect(asyncFileUpload).toHaveBeenCalledWith(
        exampleFile,
        'image',
        expect.any(Function)
      );
      expect(onUpload).toHaveBeenCalledWith([`Uploaded ${exampleFile.name}`]);
    });
  });
  // describe('Single selection', () => {
  //   test('should call asyncFileUpload with file data', async () => {
  //     render(<compositions.BasicFileUploaderSimple />);
  //     const uploadBtn = screen.getByLabelText('Upload');
  //     const exampleFile: File = new File(['hello'], 'hello.png', {
  //       type: 'image/png',
  //     });
  //     await UserEvent.upload(uploadBtn, exampleFile);
  //     await waitFor(() => expect(asyncFileUpload).toHaveBeenCalled());
  //     expect(asyncFileUpload).toHaveBeenCalledWith(
  //       exampleFile,
  //       'image',
  //       expect.any(Function)
  //     );
  //     expect(onUpload).toHaveBeenCalledWith([`Uploaded ${exampleFile.name}`]);
  //   });

  //   test('should call asyncFileUpload with file data then call on upload', async () => {
  //     render(<compositions.BasicFileUploaderHideOnUpload />);
  //     const uploadBtn = screen.getByLabelText('Upload');
  //     const exampleFile: File = new File(['hello'], 'hello.png', {
  //       type: 'image/png',
  //     });
  //     await UserEvent.upload(uploadBtn, exampleFile);
  //     await waitFor(() => expect(asyncFileUpload).toHaveBeenCalled());
  //     expect(asyncFileUpload).toHaveBeenCalledWith(
  //       exampleFile,
  //       'image',
  //       expect.any(Function)
  //     );
  //     expect(onUpload).toHaveBeenCalledWith([`Uploaded ${exampleFile.name}`]);
  //   });
  //   test.todo('should call on Upload when asyncFileUpload complete');
  // });
  describe('Error handling', () => {
    test('should handle error uploading', async () => {
      (asyncFileUpload as jest.Mock).mockImplementation(async () => {
        throw new Error('FAILED');
      });
      render(<compositions.BasicFileUploader />);
      const selectFilesBtn = screen.getByLabelText('Select Files');
      const exampleFile: File = new File(['hello'], 'hello.png', {
        type: 'image/png',
      });

      await UserEvent.upload(selectFilesBtn, exampleFile);
      const uploadBtn = screen.getByRole('button', { name: 'Upload' });
      await UserEvent.click(uploadBtn);
      await waitFor(() => expect(asyncFileUpload).toHaveBeenCalled());
      await screen.findByText('Upload Failed');
      expect(onUpload).not.toHaveBeenCalled();
    });
  });
});
