import React from 'react';
import { demoItems } from './demodata';

import { PopupMenu, RightClickWrapper } from './popup-menu';

const WrapperB = ({ children }) => {
  const handleOnClick = () => {
    alert('TEST');
  };
  return React.cloneElement(children, { ...children.props, onClick: handleOnClick });
};

const App = () => {
  return (
    <WrapperB>
      <div
        style={{
          position: 'relative',
          width: '300px',
          height: '300px',
          background: 'red',
        }}
      />
    </WrapperB>
  );
};

const WrapperC = ({ children }) => {
  const handleOnClick = () => {
    alert('TEST');
  };
  return React.cloneElement(children, { ...children.props, onClick: handleOnClick });
};

const InnerWrap = () => {
  return (
    <div
      style={{
        position: 'relative',
        width: '300px',
        height: '300px',
        background: 'red',
      }}
    />
  );
};

const AppB = () => {
  return (
    <WrapperC>
      <InnerWrap />
    </WrapperC>
  );
};

const Wrapper = () => (
  <div
    style={{
      position: 'relative',
      width: '300px',
      height: '300px',
      background: 'red',
    }}
  />
);
export const defaultPopupMenu = () => (
  <PopupMenu items={demoItems} position={{ x: 0, y: 0 }} onCloseCallback={() => {}} />
);
export const defaultPopupMenuOpen = () => (
  <PopupMenu
    items={demoItems}
    isOpenOverride
    onCloseCallback={() => {}}
    position={{ x: 0, y: 0 }}
  />
);
export const interactivePopupMenu = () => (
  <RightClickWrapper
    items={[
      { uid: 'A', label: 'Item A', onClick: () => {} },
      { uid: 'B', label: 'Item B', onClick: () => {} },
    ]}
  >
    <div
      style={{
        // position: 'relative',
        width: '300px',
        height: '300px',
        background: 'red',
      }}
    />
  </RightClickWrapper>
);
export const interactiveMultiplePopupMenu = () => (
  <div
    style={{
      // position: 'relative',
      width: '800px',
      height: '800px',
      background: 'grey',
    }}
  >
    <RightClickWrapper
      items={[
        { uid: 'A', label: 'Item A', onClick: () => {} },
        { uid: 'B', label: 'Item B', onClick: () => {} },
      ]}
    >
      <div
        style={{
          // position: 'relative',
          width: '100px',
          height: '100px',
          background: 'red',
          position: 'absolute',
          transform: 'translate(100px, 100px)',
        }}
      />
    </RightClickWrapper>
    <RightClickWrapper
      items={[
        { uid: 'C', label: 'Item C', onClick: () => {} },
        { uid: 'D', label: 'Item D', onClick: () => {} },
      ]}
    >
      <div
        style={{
          // position: 'relative',
          width: '100px',
          height: '100px',
          background: 'red',
          position: 'absolute',
          transform: 'translate(400px, 400px)',
        }}
      />
    </RightClickWrapper>
  </div>
);
export const interactiveEmbeddedPopupMenu = () => (
  <RightClickWrapper
    items={[
      { uid: 'A', label: 'Item A', onClick: () => {} },
      { uid: 'B', label: 'Item B', onClick: () => {} },
    ]}
  >
    <Wrapper />
  </RightClickWrapper>
);
export const popupMenu1 = () => <App />;
export const popupMenu2 = () => <AppB />;
