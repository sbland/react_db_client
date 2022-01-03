import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import { mount } from 'enzyme';
import { FilterObjectSimpleClass } from '@samnbuk/react_db_client.constants.client-types';

import {
  demoDatatype,
  demoFieldsData,
  demoPageData,
  demoTemplateData,
} from '@samnbuk/react_db_client.components.meta.meta-demo-data';

import * as compositions from './meta-view-manager.composition';
import { defaultProps } from './demo-data';
import { MetaViewManager } from './meta-view-manager';

const asyncGetDocument = jest.fn().mockImplementation(async (c, i) => {
  switch (c) {
    case 'pages':
      return demoPageData;
    case 'datatypes':
      return demoDatatype;
    case 'templates':
      return demoTemplateData;
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

const onSubmitCallback = jest.fn();
const asyncPutDocument = jest.fn();
const asyncPostDocument = jest.fn();
const asyncDeleteDocument = jest.fn();

const defaultTestProps = {
  ...defaultProps,
  onSubmitCallback,
  asyncGetDocument,
  asyncGetDocuments,
  asyncPutDocument,
  asyncPostDocument,
  asyncDeleteDocument,
};

const setupComponent = async () => {
  let component;
  act(() => {
    component = render(<MetaViewManager {...defaultTestProps} />);
  });
  await act(async () => {
    // component.update();
    await new Promise((resolve) => setTimeout(resolve));
  });
  return component;
};

const resetMocks = () => {
  onSubmitCallback.mockClear();
  asyncGetDocument.mockClear();
  asyncGetDocuments.mockClear();
  asyncPutDocument.mockClear();
  asyncPostDocument.mockClear();
  asyncDeleteDocument.mockClear();
};

/* Tests */
describe('Meta View Manager', () => {
  beforeEach(() => {
    resetMocks();
  });
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, async () => {
        let component;
        act(() => {
          component = mount(<Composition />);
        });
        await act(async () => {
          component.update();
          await new Promise((resolve) => setTimeout(resolve));
        });
      });
    });
  });
  describe('Unit Test', () => {
    describe('Loads data to meta view', () => {
      test('should call async get document to load page data', async () => {
        await setupComponent();
        expect(asyncGetDocument).toHaveBeenCalledWith('pages', demoPageData.uid, 'all', 'all');
      });
      test('should have loaded dataype data', async () => {
        render(<MetaViewManager {...defaultTestProps} />);
        await screen.findByText('Loading Page Data');
        await waitFor(() => expect(asyncGetDocument).toHaveBeenCalledTimes(2));
        expect(asyncGetDocument).toHaveBeenCalledWith(
          'datatypes',
          demoPageData.datatype.uid,
          'all',
          'all'
        );
      });
      test('should have loaded fields data', async () => {
        render(<MetaViewManager {...defaultTestProps} />);
        await screen.findByText('Loading Page Data');
        await waitFor(() => expect(asyncGetDocuments).toHaveBeenCalledTimes(1));
        const filters = [
          new FilterObjectSimpleClass(
            '_id',
            Object.values(demoFieldsData).map((d) => d._id),
            'fieldIdFilter'
          ),
        ];
        expect(asyncGetDocuments).toHaveBeenCalledWith('fields', filters, 'all');
      });

      describe('should start in view mode', () => {
        test('Should be no inputs ', async () => {
          //
        });
        test('should contain a labeled readonly metaview field', async () => {
          await setupComponent();
          const field = screen.getByLabelText(demoFieldsData.fa.label);
          expect(field).toHaveTextContent(demoPageData.data.fa);
        });
        test('should not include invalid fields', async () => {
          await setupComponent();
          const invalidFields = screen.queryByText('Invalid Field');
          expect(invalidFields).not.toBeInTheDocument();
        });
      });
    });
    describe('Edit mode', () => {
      const openEditMode = () => {
        const editButton = screen.getByText('Edit View');
        fireEvent.click(editButton);
      };
      test('should allow opening edit mode', async () => {
        await setupComponent();
        openEditMode();
      });
      test('should show save button when in edit mode', async () => {
        await setupComponent();
        const saveBtnBefore = screen.queryByText('Save');
        expect(saveBtnBefore).not.toBeInTheDocument();
        openEditMode();
        const saveBtnAfter = screen.queryByText('Save');
        expect(saveBtnAfter).toBeInTheDocument();
      });

      test('should show cancel button when in edit mode', async () => {
        await setupComponent();
        const saveBtnBefore = screen.queryByText('Cancel');
        expect(saveBtnBefore).not.toBeInTheDocument();
        openEditMode();
        const saveBtnAfter = screen.queryByText('Cancel');
        expect(saveBtnAfter).toBeInTheDocument();
      });

      test('should show inputs for each field', async () => {
        await setupComponent();
        const fieldsBefore = screen.queryAllByRole('textbox');
        expect(fieldsBefore.length).toEqual(0);
        openEditMode();
        const fieldsAfter = screen.queryAllByRole('textbox');
        expect(fieldsAfter.length).toBeGreaterThan(0);
      });
      test('should allow editing a field', async () => {
        await setupComponent();
        openEditMode();
        const field = screen.getByLabelText(demoFieldsData.fa.label);
        const newVal = 'newval';
        expect(field).toHaveDisplayValue(demoPageData.data.fa);
        fireEvent.change(field, { target: { value: newVal } });
        expect(field).toHaveDisplayValue(newVal);
      });
      test('should allow editing a field b', async () => {
        await setupComponent();
        openEditMode();
        const fielda = screen.getByLabelText(demoFieldsData.fa.label);
        const fieldb = screen.getByLabelText(demoFieldsData.fb.label);
        const newVal = 'newval';
        expect(fielda).toHaveDisplayValue(demoPageData.data.fa);
        fireEvent.change(fieldb, { target: { value: newVal } });
        expect(fielda).toHaveDisplayValue(demoPageData.data.fa);
        expect(fieldb).toHaveDisplayValue(newVal);
      });
    });
  });
});
