import React from 'react';
import { screen, render, within, waitFor, act } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import * as compositions from './file-uploader.composition';
import { onUpload, asyncFileUpload } from './dummy-data';

jest.mock('./dummy-data', () => ({
  asyncFileUpload: jest.fn(),
  onUpload: jest.fn(),
}));
const mockImage = {
  src: null,
  onload: () => {},
  onerror: () => {},
  width: 100,
  height: 200,
};
let images: typeof mockImage[] = [];

beforeEach(() => {
  images = [];
  (asyncFileUpload as jest.Mock).mockClear().mockImplementation(async () => {});
  (onUpload as jest.Mock).mockClear();
  global.URL.createObjectURL = jest.fn().mockImplementation(() => 'testURL');
  // @ts-ignore
  window.Image = function () {
    const image = { ...mockImage };
    images.push(image);
    return image;
  };
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
      await waitFor(() => expect(uploadBtn).toBeDisabled());
      act(() => {
        images.forEach((image) => image.onload());
      });
      await waitFor(() => expect(uploadBtn).not.toBeDisabled());
      await UserEvent.click(uploadBtn);
      await waitFor(() => expect(asyncFileUpload).toHaveBeenCalled());
      expect(asyncFileUpload).toHaveBeenCalledWith(
        exampleFile,
        'image',
        expect.any(Function),
        { width: images[0].width, height: images[0].height, name: 'hello.png' }
      );
      expect(onUpload).toHaveBeenCalledWith([`Uploaded ${exampleFile.name}`]);
    });
  });
  describe('Document Files', () => {
    test.todo('should upload document files');
  });
  describe('Image Files', () => {
    test('should add image dimensions to file meta data', async () => {
      render(<compositions.BasicFileUploader />);
      const selectFilesBtn = screen.getByLabelText('Select Files');
      const exampleFile: File = new File(['hello'], 'hello.png', {
        type: 'image/png',
      });
      await UserEvent.upload(selectFilesBtn, exampleFile);
      act(() => {
        images.forEach((image) => image.onload());
      });
      const uploadBtn = screen.getByRole('button', { name: 'Upload' });
      await waitFor(() => expect(uploadBtn).not.toBeDisabled());
      await UserEvent.click(uploadBtn);
      await waitFor(() => expect(asyncFileUpload).toHaveBeenCalled());
      expect(asyncFileUpload).toHaveBeenCalledWith(
        exampleFile,
        'image',
        expect.any(Function),
        { width: images[0].width, height: images[0].height, name: 'hello.png' }
      );
      expect(onUpload).toHaveBeenCalledWith([`Uploaded ${exampleFile.name}`]);
    });
    test('should be able to upload multiple image files', async () => {
      render(<compositions.BasicFileUploader />);
      const selectFilesBtn = screen.getByLabelText('Select Files');
      const exampleFileA: File = new File(['Foo'], 'foo.png', {
        type: 'image/png',
      });
      const exampleFileB: File = new File(['Bar'], 'bar.png', {
        type: 'image/png',
      });
      const exampleFiles = [exampleFileA, exampleFileB];
      await UserEvent.upload(selectFilesBtn, exampleFiles);
      act(() => {
        images.forEach((image) => image.onload());
      });
      const uploadBtn = screen.getByRole('button', { name: 'Upload' });
      await waitFor(() => expect(uploadBtn).not.toBeDisabled());
      await UserEvent.click(uploadBtn);
      await waitFor(() => expect(asyncFileUpload).toHaveBeenCalled());
      expect(asyncFileUpload).toHaveBeenCalledWith(
        exampleFileA,
        'image',
        expect.any(Function),
        { width: images[0].width, height: images[0].height, name: 'foo.png' }
      );
      expect(asyncFileUpload).toHaveBeenCalledWith(
        exampleFileB,
        'image',
        expect.any(Function),
        { width: images[1].width, height: images[1].height, name: 'bar.png' }
      );
      // expect(onUpload).toHaveBeenCalledWith([`Uploaded ${exampleFile.name}`]);
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
      act(() => {
        images.forEach((image) => image.onload());
      });
      const uploadBtn = screen.getByRole('button', { name: 'Upload' });
      await waitFor(() => expect(uploadBtn).not.toBeDisabled());
      await UserEvent.click(uploadBtn);
      await waitFor(() => expect(asyncFileUpload).toHaveBeenCalled());
      await screen.findByText('Upload Failed');
      expect(onUpload).not.toHaveBeenCalled();
    });
  });
});
