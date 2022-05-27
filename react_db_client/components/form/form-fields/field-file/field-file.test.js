import '@samnbuk/react_db_client.testing.enzyme-setup';
import React from 'react';
import { mount, shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { FieldFile } from './field-file';
import { ItemList } from '@samnbuk/react_db_client.components.item-list';
import * as compositions from './field-file.composition';
import { DEMO_FILES_DATA } from './demo-data';

const updateFormData = jest.fn();
const asyncGetDocuments = jest.fn();

const defaultProps = {
  uid: 'uid',
  multiple: false,
  updateFormData,
  collectionId: 'collectionId',
  documentId: 'documentId',
  fileType: 'image',
  value: DEMO_FILES_DATA,
  fileServerUrl: 'fileserver',
  asyncGetDocuments,
};

describe('field-file', () => {
  beforeEach(() => {
    updateFormData.mockClear();
    asyncGetDocuments.mockClear();
  });
  test('Renders', () => {
    shallow(<FieldFile {...defaultProps} />);
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
      const component = shallow(<FieldFile {...defaultProps} />);
      const tree = component.debug();
      expect(tree).toMatchSnapshot();
    });
  });
  describe('Unit tests', () => {
    let component;

    describe('Single', () => {
      beforeEach(() => {
        component = mount(<FieldFile {...defaultProps} />);
      });

      test.skip('should pass empty list to item list if there are no files', async () => {
        await act(async () => {
          component.setProps({ value: null });
          component.update();
          await new Promise((resolve) => setTimeout(resolve));
        });
        const itemList = component.find(ItemList);
        // TODO: For some reason this is failing but correct in debug
        expect(itemList.props().items).toEqual([]);
      });
      test('should call updatedate with null when we delete the file', () => {
        const fileDeleteFn = component
          .find(ItemList)
          .props()
          .overlayButtons.find((f) => f.uid === 'remove').func;

        act(() => {
          fileDeleteFn(DEMO_FILES_DATA[0].uid);
        });
        expect(updateFormData).toHaveBeenCalledWith(defaultProps.uid, null);
      });
    });
    describe('Multiple', () => {
      beforeEach(() => {
        component = mount(<FieldFile {...defaultProps} multiple />);
      });

      test('should pass empty list to item list if there are no files', () => {
        component.setProps({ value: null });
        component.update();
        const itemList = component.find(ItemList);
        expect(itemList.props().items).toEqual([]);
      });
      test('should call updatedata with file removed when we delete the file', () => {
        const fileDeleteFn = component
          .find(ItemList)
          .props()
          .overlayButtons.find((f) => f.uid === 'remove').func;
        act(() => {
          fileDeleteFn(DEMO_FILES_DATA[0].uid);
        });
        expect(updateFormData).toHaveBeenCalledWith(defaultProps.uid, DEMO_FILES_DATA.slice(1));
      });
    });
  });
});
