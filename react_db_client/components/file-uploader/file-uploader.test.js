import '@samnbuk/react_db_client.testing.enzyme-setup';
import React from 'react';
import { mount, shallow } from 'enzyme';

import { FileUploader } from './file-uploader';
import * as compositions from './file-uploader.composition';
import { StyledSelectList } from '@samnbuk/react_db_client.components.styled-select-list';

const asyncUpload = jest.fn();
const onUpload = jest.fn();

const defaultProps = {
  collectionId: 'demoCollectionId',
  documentId: 'demoDocumentId',
  fileType: 'image',
  asyncUpload,
  onUpload,
};

describe('file-uploader', () => {
  beforeEach(() => {
    asyncUpload.mockClear();
    onUpload.mockClear();
  });
  test('Renders', () => {
    shallow(<FileUploader {...defaultProps} />);
  });

  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, () => {
        mount(<Composition />);
      });
    });
  });
  describe('shallow renders', () => {
    test('Matches Snapshot', () => {
      const component = shallow(<FileUploader {...defaultProps} />);
      const tree = component.debug();
      expect(tree).toMatchSnapshot();
    });
  });
  describe('Unit Testing', () => {
    let component;
    beforeEach(() => {
      component = mount(<FileUploader {...defaultProps} />);
    });
    test('should add files to selected on file select', () => {
      const fileInput = component.find('.fileUploader_fileInput');
      expect(fileInput).toBeTruthy();
      const event = {
        target: {
          name: 'pollName',
          files: [
            { uid: 'fileA', name: 'fileA' },
            { uid: 'fileB', name: 'fileB' },
          ],
        },
      };
      fileInput.simulate('change', event);
      const fileList = component.find(StyledSelectList);
      expect(fileList.props().listInput.length).toEqual(2);
      const tree = component.debug();
      expect(tree).toMatchSnapshot();
    });

    // test('should send a xhr request on clicking the upload button', () => {
    //   // TODO: Test we call uploader hook here
    //   const uploadBtn = component.find('.uploadBtn');
    //   uploadBtn.simulate('click');
    // });
  });
});
