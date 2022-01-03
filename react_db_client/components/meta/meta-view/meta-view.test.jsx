import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { mount } from 'enzyme';

import {
  demoFieldsData,
  demoPageData,
} from '@samnbuk/react_db_client.components.meta.meta-demo-data';


import { MetaView } from './meta-view';
import * as compositions from './meta-view.composition';
import { defaultProps } from './demo-data';

const updateFormData = jest.fn();

const defaultTestProps = {
  ...defaultProps,
  updateFormData,
};

/* Tests */
describe('Meta View', () => {
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, () => {
        mount(<Composition />);
      });
    });
  });
  describe('Unit Tests', () => {
    beforeEach(() => {
      updateFormData.mockClear();
    });
    describe('View Mode', () => {
      describe('renders fields', () => {
        test('should render read only text', () => {
          render(<MetaView {...defaultTestProps} />);
          const field = screen.getByLabelText(demoFieldsData.fa.label);
          expect(field).toHaveTextContent(demoPageData.data.fa);
        });
        test('should not render any text fields', () => {
          render(<MetaView {...defaultTestProps} />);
          const fields = screen.queryAllByRole('textbox');
          expect(fields.length).toEqual(0);
        });
      });
    });
    describe('Edit Mode', () => {
      test('renders fields', () => {
        render(<MetaView {...defaultTestProps} viewMode="edit" />);
        const field = screen.getByLabelText(demoFieldsData.fa.label);
        expect(field).toHaveValue(demoPageData.data.fa);
      });

      test('Changing values', () => {
        render(<MetaView {...defaultTestProps} viewMode="edit" />);
        const field = screen.getByLabelText(demoFieldsData.fa.label);
        const newVal = 'newVal';
        fireEvent.change(field, { target: { value: newVal } });
        expect(updateFormData).toHaveBeenCalledWith(demoFieldsData.fa._id, newVal);
      });
    });
  });
});
