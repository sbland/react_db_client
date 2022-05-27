import '@samnbuk/react_db_client.testing.enzyme-setup';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { AreYouSureBtn } from './are-you-sure-btn';

const onConfirmed = jest.fn();
const PopupPanel = jest.fn().mockImplementation(({ isOpen, children }) => isOpen ? children : '');

const defaultProps = {
  onConfirmed,
  message: 'Yes',
  disabled: false,
  className: 'demoClass',
  btnText: 'Click me',
  PopupPanel,
};

describe('AreYouSureBtn', () => {
  it('Renders', () => {
    shallow(<AreYouSureBtn {...defaultProps} />);
  });
  it('Matches Snapshot', () => {
    const component = shallow(<AreYouSureBtn {...defaultProps} />);
    const tree = component.debug();
    expect(tree).toMatchSnapshot();
  });
  describe('Unit Tests', () => {
    let component;
    beforeEach(() => {
      component = mount(<AreYouSureBtn {...defaultProps} />);
    });
    describe('are you sure process', () => {
      const clickBtn = (c) => {
        const btn = c.find('.areYouSureBtn');
        btn.simulate('click');
      };
      test('should open are you sure panel when btn button pressed', () => {
        let areYouSurePanel = component.find(PopupPanel);
        expect(areYouSurePanel.props().isOpen).toEqual(false);
        clickBtn(component);
        areYouSurePanel = component.find(PopupPanel);
        expect(areYouSurePanel.props().isOpen).toEqual(true);
      });
      test('should call confirm id when we click accept button in are you sure panel', () => {
        clickBtn(component);
        let areYouSurePanel = component.find(PopupPanel);
        const areYouSureAcceptBtn = areYouSurePanel.find('.areYouSure_acceptBtn');
        areYouSureAcceptBtn.simulate('click');
        areYouSurePanel = component.find(PopupPanel);
        expect(areYouSurePanel.props().isOpen).toEqual(false);
        expect(onConfirmed).toHaveBeenCalledWith();
      });
    });
  });
});
