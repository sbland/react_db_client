/* eslint-disable camelcase */
import '@samnbuk/react_db_client.helpers.enzyme-setup';
import { renderHook, act } from '@testing-library/react-hooks';
import { demoDatatype, demoFieldsData, demoPageData, demoTemplateData } from './demo-data';
import { useViewDataManager } from './use-view-data-manager';

Date.now = jest.fn().mockImplementation(() => 0);

const asyncGetDocument = jest.fn().mockImplementation(async (c, i) => {
  switch (c) {
    case 'pages':
      return demoPageData;
    case 'datatypes':
      return demoDatatype;
    case 'templates':
      return demoTemplateData;
    case 'fields':
      return demoFieldsData;
    default:
      throw Error(`Not mocked: ${c}: ${i}`);
  }
});

const asyncGetDocuments = jest.fn().mockImplementation(async (c, i) => {
  switch (c) {
    case 'fields':
      return demoFieldsData;
    default:
      throw Error(`Not mocked: ${c}: ${i}`);
  }
});

const asyncPutDocument = jest.fn().mockImplementation(async () => {});
const asyncPostDocument = jest.fn().mockImplementation(async () => {});
const asyncDeleteDocument = jest.fn().mockImplementation(async () => {});
const onSavedCallback = jest.fn();

const defaultArgs = {
  activeUid: 'demouid',
  collection: 'democollection',
  isNew: false,
  inputAdditionalData: {},
  schema: 'all',
  populate: 'all',
  loadOnInit: true,
  onSavedCallback,
  asyncGetDocuments,
  asyncGetDocument,
  asyncPutDocument,
  asyncPostDocument,
  asyncDeleteDocument,
};

describe('View Data Manager Hook', () => {
  beforeEach(() => {
    asyncGetDocuments.mockClear();
    asyncGetDocument.mockClear();
    asyncPutDocument.mockClear();
    asyncPostDocument.mockClear();
    asyncDeleteDocument.mockClear();
  });
  describe('Loading Data', () => {
    test.only('should load page data using UID', async () => {
      const { waitForNextUpdate } = renderHook(() => useViewDataManager(defaultArgs));
      await waitForNextUpdate();
      expect(asyncGetDocument).toHaveBeenCalledWith('pages', defaultArgs.activeUid);
    });
    test.skip('should load datatype from datatype id', () => {
      //
    });
    test.skip('should load template data once datatype is loaded', () => {
      //
    });
    test.skip('should return page data', () => {
      //
    });
    test.skip('should return datatype data', () => {
      //
    });
    test.skip('should return template data', () => {
      //
    });
  });
  describe('load data cache', () => {
    test.skip('should use cache for template data if hass already loaded', () => {
      //
    });
  });
});
