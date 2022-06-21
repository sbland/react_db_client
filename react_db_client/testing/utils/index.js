/* eslint-disable react/prop-types */
import React from 'react';
import { render } from '@testing-library/react';

export function MockReactC(name, namedExports = [], namedDefinedExports = {}) {
  function MockedComponent(props) {
    const { children } = props;
    return (
      <div data-testid={name}>
        {name}
        {children}
      </div>
    );
  }
  MockedComponent.displayName = name;

  const namedExportComponents = namedExports.reduce((acc, item) => {
    const accCopy = { ...acc };
    function MockedComponentNamed({ children }) {
      return (
        <div data-testid={name}>
          {item}
          {children}
        </div>
      );
    }
    accCopy[item] = MockedComponentNamed;
    accCopy[item].displayName = item;
    return accCopy;
  }, {});

  return {
    __esModule: true,
    default: MockedComponent,
    ...namedExportComponents,
    ...namedDefinedExports,
  };
}

export function MockEs6(name, namedExports = {}, namedExportsList = []) {
  const mockDefault = jest.fn();
  mockDefault.displayName = name;

  const namedExportComponents = namedExportsList.reduce((acc, item) => {
    const accCopy = { ...acc };
    accCopy[item] = jest.fn();
    accCopy[item].displayName = item;
    return accCopy;
  }, {});
  return {
    __esModule: true,
    default: mockDefault,
    ...namedExports,
    ...namedExportComponents,
  };
}

export const atimeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const findById = (wrapper, id) => wrapper.findWhere((n) => n.props().id === id);

export const setupAsyncMocks = (callFnMap) => (props) => {
  const { id } = props;
  const mock = callFnMap[id];
  if (mock) return mock;
  throw Error(`${id} missing in callFnMap`);
};
export const sleep = (delay) =>
  new Promise((res) => {
    setTimeout(function () {
      res();
    }, delay);
  });

const CustomTestWrapper = ({ children }) => {
  return <>{children}</>;
};

const customRender = (ui, options = {}) => render(ui, { wrapper: CustomTestWrapper, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
