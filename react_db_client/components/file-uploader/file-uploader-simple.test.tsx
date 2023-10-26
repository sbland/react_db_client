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
let images: (typeof mockImage)[] = [];

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

describe('File uploader simple', () => {
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
    test('should auto upload files on select and call asyncFileUpload', async () => {
      render(<compositions.BasicFileUploaderSimple />);
      const selectFilesBtn = screen.getByLabelText('Upload');
      const exampleFile: File = new File(['hello'], 'hello.png', {
        type: 'image/png',
      });
      await UserEvent.upload(selectFilesBtn, exampleFile);
      act(() => {
        images.forEach((image) => image.onload());
      });
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
  describe.skip('Error handling', () => {
    test.todo('should handle error uploading');
  });
});
