import '@samnbuk/react_db_client.testing.enzyme-setup';
import React from 'react';
import { mount, shallow } from 'enzyme';
import { MockReactC } from '@react_db_client/testing.utils';
import { SearchAndSelect } from '@react_db_client/components.search-and-select';
import { EFileType } from '@react_db_client/constants.client-types';

import { FileManager } from './file-manager';
import * as compositions from './file-manager.composition';
import { demoSearchResults } from './demo-data';

jest.mock('@react_db_client/components.search-and-select', () =>
  MockReactC('SearchAndSelect', ['SearchAndSelect'])
);
jest.mock('@react_db_client/components.file-uploader', () =>
  MockReactC('FileUploader', ['FileUploader'])
);

Date.now = jest.fn(() => 123); //14.02.2017
const handleSelect = jest.fn();
const asyncFileUpload = jest.fn();
const asyncGetFiles = jest
  .fn()
  .mockReturnValue(new Promise((resolve) => resolve(demoSearchResults)));

const defaultProps = {
  handleSelect,
  fileType: EFileType.IMAGE,
  allowMultiple: false,
  asyncGetFiles,
  fileServerUrl: 'fileserverurl',
  asyncFileUpload,
};

describe('file-manager', () => {
  beforeEach(() => {
    handleSelect.mockClear();
    asyncGetFiles.mockClear();
  });
  test('Renders', () => {
    shallow(<FileManager {...defaultProps} />);
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
      const component = shallow(<FileManager {...defaultProps} />);
      const tree = component.debug();
      expect(tree).toMatchSnapshot();
    });

    describe('Unit Testing', () => {
      let component;
      beforeEach(() => {
        component = mount(<FileManager {...defaultProps} />);
      });
      test('should call asyncGetDocuments when searchFunction called', () => {
        const sortBy = 'name';
        const searchString = 'searchStr';
        const filters = [];
        const schema = ['uid', 'name', 'updatedAt', 'createdAt', 'fileType', 'filePath'];

        const sas = component.find(SearchAndSelect);
        sas.props().searchFunction([], sortBy, searchString, schema);

        expect(asyncGetFiles).toHaveBeenCalledWith(filters, sortBy, searchString, schema);
      });
      test('should call handle select when search and select handle select called', () => {
        const sas = component.find(SearchAndSelect);
        const selectionData = {
          uid: 'abc',
          name: 'ABC',
        };
        sas.props().handleSelect(selectionData.uid, selectionData);
        expect(handleSelect).toHaveBeenCalledWith(selectionData.uid, selectionData);
      });
    });
  });
});
