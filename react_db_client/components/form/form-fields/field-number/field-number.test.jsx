import '@samnbuk/react_db_client.testing.enzyme-setup';
import React from 'react';
import { shallow, mount } from 'enzyme';
import * as compositions from './field-number.composition';
import { FieldNumber } from './field-number';
import { defaultProps } from './default-val';

describe('field number', () => {
  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, () => {
        mount(<Composition />);
      });
    });
  });
  describe('Unit Tests', () => {
    describe('Parse Input', () => {
      [0, 1, 2].map((val) =>
        test(`should parse input values: ${val}`, () => {
          const component = mount(<FieldNumber {...defaultProps} value={val} />);
          const input = component.find('input');
          expect(input.props().value).toEqual(val);
        })
      );
      [undefined, null, '', 'jlkjl'].map((val) =>
        test(`should parse input invalid values: ${val}`, () => {
          const component = mount(<FieldNumber {...defaultProps} value={val} />);
          const input = component.find('input');
          expect(input.props().value).toEqual('');
        })
      );

      ['1', '2', '1.2', '0'].map((val) =>
        test(`should parse input invalid values: ${val}`, () => {
          const component = mount(<FieldNumber {...defaultProps} value={val} />);
          const input = component.find('input');
          expect(input.props().value).toEqual(Number(val));
        })
      );
    });
    describe('Modifying Input', () => {
      const val = '';
      const getComponent = () => mount(<FieldNumber {...defaultProps} value={val} />);
      test('should set to empty if value is empty', () => {
        const component = getComponent();
        const input = component.find('input');
        expect(input.props().value).toEqual(val);
      });
      test('should set to empty if value is empty and defocus', () => {
        const component = getComponent();
        const input = () => component.find('input');
        input().simulate('focus');
        input().simulate('blur');
        expect(input().props().value).toEqual(val);
      });
    });
  });
});
