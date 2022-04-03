import React from 'react';
import { shallow, mount } from 'enzyme';

import ErrorBoundary from './ErrorBoundary';

// const DemoComponent = ({data}) => <div>Hi World</div>;
const DemoComponent = ({data}) => <div>{data.map((a) => a.label)}</div>;

describe('ErrorBoundary', () => {
  it('Renders', () => {
    mount(
      <ErrorBoundary onError={() => {}}>
        <DemoComponent data={[{ label: 'hi' }]} />
      </ErrorBoundary>,
    );
  });
  it('Matches Snapshot', () => {
    const component = mount(
      <ErrorBoundary onError={() => {}}>
        <DemoComponent data={[{ label: 'hi' }]} />
      </ErrorBoundary>,
    );
    const tree = component.debug();
    expect(tree).toMatchSnapshot();
  });
  describe('Unit Testing', () => {
    const component = mount(
      <ErrorBoundary onError={() => {}}>
        <DemoComponent data={[{ label: 'hi' }]} />
      </ErrorBoundary>,
    );
    test('exists', () => {
      expect(component).toBeTruthy();
    });
  });
});
