import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
import { mount, shallow } from 'enzyme';

import { FieldTextArea } from './field-text-area';
import * as compositions from './field-text-area.composition';
import { defaultVal } from './demo-data';

const updateFormData = jest.fn();

const defaultProps = {
  uid: 'uid',
  unit: 'unit',
  value: defaultVal,
  updateFormData,
};

describe('field-text-area', () => {
  beforeEach(() => {
    updateFormData.mockClear();
  });
  test('Renders', () => {
    shallow(<FieldTextArea {...defaultProps} />);
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
      const component = shallow(<FieldTextArea {...defaultProps} />);
      const tree = component.debug();
      expect(tree).toMatchSnapshot();
    });
  });
  describe('Unit Tests', () => {
    let component;
    let spyRef;
    beforeEach(() => {
      spyRef = jest.spyOn(React, 'useRef');
      spyRef.mockReturnValue({ current: { scrollHeight: 100 } });
      component = shallow(<FieldTextArea {...defaultProps} />);
    });
    describe('Auto size', () => {
      test('should autosize to initial content', async () => {
        spyRef.mockReturnValue({ current: { scrollHeight: 100 } });
        component.update();
        const textArea = component.find('textarea');
        expect(textArea.props().style.height).toEqual('auto');
        // await new Promise((resolve) => setTimeout(resolve));
        // TODO: THis works but not in test.
        // expect(textArea.props().style.height).toEqual(10);
      });
    });
  });
});
