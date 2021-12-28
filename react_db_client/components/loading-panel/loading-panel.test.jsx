import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
import { shallow, mount } from 'enzyme';

import { wrapWithLoadingOverlay } from './LoadingWrap';

jest.mock('./LoadingPanel');

const DemoComponent = () => <div>Demo</div>;

const DemoComponentWrapped = wrapWithLoadingOverlay(DemoComponent);

// FIXME: need to fix this as broken with reactdom loadingwrap
describe.skip('LoadingWrap', () => {
  it('Renders', () => {
    shallow(<DemoComponentWrapped />);
  });
  it('Matches Snapshot', () => {
    const component = mount(<DemoComponentWrapped />);
    component.update();
    const tree = component.debug();
    expect(tree).toMatchSnapshot();
  });
  it('Matches Snapshot - loading', () => {
    const component = mount(<DemoComponentWrapped loading />);
    component.update();
    const tree = component.debug();
    expect(tree).toMatchSnapshot();
  });
  describe('Unit Testing', () => {
    const component = mount(<DemoComponentWrapped />);
    test('should show loading when passed loading prop', () => {
      expect.assertions(2);
      component.update();
      expect(component.find(DemoComponent).props().loading).not.toBeTruthy();
      component.setProps({ loading: true });
      expect(component.find(DemoComponent).props().loading).toBeTruthy();
    });
    test('should show has loaded when loading finishes', () => {
      component.update();
      expect(component.find(DemoComponent).props().hasLoaded).not.toBeTruthy();
      component.setProps({ loading: false });
      component.update();
      expect(component.find(DemoComponent).props().hasLoaded).toBeTruthy();
    });
    test('should show has not loaded when we set loading back to true', () => {
      component.update();
      expect(component.find(DemoComponent).props().hasLoaded).toBeTruthy();
      component.setProps({ loading: true });
      component.update();
      expect(component.find(DemoComponent).props().hasLoaded).not.toBeTruthy();
    });
  });
});
