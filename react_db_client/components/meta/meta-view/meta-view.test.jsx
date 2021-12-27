import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { mount } from 'enzyme';

import { MetaView } from './meta-view';
import * as compositions from './meta-view.composition';
import { defaultProps, demoFieldsData, demoPageData } from './demo-data';

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
    })
    describe('renders fields', () => {
      render(<MetaView {...defaultTestProps} viewMode="edit" />);
      const field = screen.getByLabelText(demoFieldsData.fa.label);
      expect(field).toHaveValue(demoPageData.fa);
    });

    describe('Changing values', () => {
      render(<MetaView {...defaultTestProps} />);
      const field = screen.getByLabelText(demoFieldsData.fa.label);
      const newVal = 'newVal';
      fireEvent.change(field, {target: { value: newVal}})
      expect(updateFormData).toHaveBeenCalledWith(demoFieldsData.fa.uid, newVal);
    });
  });
});
