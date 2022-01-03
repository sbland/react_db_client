/* eslint-disable camelcase */
import '@samnbuk/react_db_client.helpers.enzyme-setup';
import { renderHook, act } from '@testing-library/react-hooks';
import { FilterObjectSimpleClass } from '@samnbuk/react_db_client.constants.client-types';

import {
  demoDatatype,
  demoFieldsData,
  demoPageData,
  demoTemplateData,
} from '@samnbuk/react_db_client.components.meta.meta-demo-data';

import { useViewDataManager } from './use-view-data-manager';
import { getFieldsListFromTemplate, useGetFieldsData } from './use-get-fields-data';

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
      return Object.values(demoFieldsData);
    default:
      throw Error(`Not mocked: ${c}: ${i}`);
  }
});

const asyncPutDocument = jest.fn().mockImplementation(async () => {});
const asyncPostDocument = jest.fn().mockImplementation(async () => {});
const asyncDeleteDocument = jest.fn().mockImplementation(async () => {});
const onSavedCallback = jest.fn();

const defaultArgs = {
  activeUid: demoPageData.uid,
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
    test('should load page data using UID', async () => {
      const { waitForNextUpdate } = renderHook(() => useViewDataManager(defaultArgs));
      await waitForNextUpdate();
      expect(asyncGetDocument).toHaveBeenCalledWith('pages', defaultArgs.activeUid, 'all', 'all');
    });
    test('should load datatype from datatype id', async () => {
      const { waitForNextUpdate } = renderHook(() => useViewDataManager(defaultArgs));
      await waitForNextUpdate();
      expect(asyncGetDocument).toHaveBeenCalledWith('datatypes', demoDatatype.uid, 'all', 'all');
      expect(asyncGetDocument).toHaveBeenCalledTimes(2);
    });
    test('should load fields data', async () => {
      const { waitForNextUpdate } = renderHook(() => useViewDataManager(defaultArgs));
      await waitForNextUpdate();
      const filters = [
        new FilterObjectSimpleClass(
          '_id',
          Object.values(demoFieldsData).map((d) => d._id),
          'fieldIdFilter'
        ),
      ];
      expect(asyncGetDocuments).toHaveBeenCalledWith('fields', filters, 'all');
      expect(asyncGetDocuments).toHaveBeenCalledTimes(1);
    });
    test.skip('should load template data once datatype is loaded', () => {
      //
    });
    test('should return page data', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useViewDataManager(defaultArgs));
      await waitForNextUpdate();
      expect(result.current.pageData).toEqual(demoPageData);
    });
    test('should return datatype data', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useViewDataManager(defaultArgs));
      await waitForNextUpdate();
      expect(result.current.datatypeData).toEqual(demoDatatype);
    });
    test('should return template data', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useViewDataManager(defaultArgs));
      await waitForNextUpdate();
      expect(result.current.templateData).toEqual(demoTemplateData);
    });

    test('should return fields data', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useViewDataManager(defaultArgs));
      await waitForNextUpdate();
      expect(result.current.fieldsData).toEqual(demoFieldsData);
    });
  });
  describe('load data cache', () => {
    test.skip('should use cache for template data if hass already loaded', () => {
      //
    });
  });
  describe('updating data', () => {
    test('should change page data when update form data called', async () => {
      const { result, waitForNextUpdate } = renderHook(() => useViewDataManager(defaultArgs));
      await waitForNextUpdate();
      // console.info(result.current.pageData);
      expect(result.current.pageData.data.fa).toEqual(demoPageData.data.fa);
      const key = 'fa';
      const value = 'newVal';
      act(() => {
        result.current.updateFormData(key, value);
      });
      expect(result.current.pageData.data.fa).toEqual(value);
    });
  });
});

describe('map fields', () => {
  describe('Get fields list from template', () => {
    test('should return a list of fields in the template', () => {
      const fields = getFieldsListFromTemplate(demoTemplateData);
      expect(fields).toEqual([demoFieldsData.fa._id, demoFieldsData.fb._id]);
    });
  });
  describe('Get Fields Data Hook', () => {
    test('should load data', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useGetFieldsData({ templateData: demoTemplateData, asyncGetDocuments })
      );
      await waitForNextUpdate();
      expect(result.current.loading).toEqual(false);
      expect(result.current.hasLoaded).toEqual(true);
      expect(result.current.fieldsData).toEqual(demoFieldsData);
    });
  });
});
