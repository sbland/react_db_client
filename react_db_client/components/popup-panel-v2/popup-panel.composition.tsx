import React from 'react';
import { PopupPanel } from './popup-panel';
import { PopupPanelContext, PopupProvider } from './popup-panel-provider';
import { PopupContentWrap } from './popup-panel-content-wrap';
import {
  PopupPanelManaged,
  PopupPanelManagedWithContentWrap,
} from './managed-popup-panel';

const OpenPopupButton = ({ id }) => {
  const { openPopup } = React.useContext(PopupPanelContext);
  return <button onClick={() => openPopup(id)}>Open</button>;
};

const PopupPanelDebug = () => {
  const { popupRegister } = React.useContext(PopupPanelContext);

  return <>{JSON.stringify(popupRegister)}</>;
};

export const BasicPopupPanel = () => {
  const id = 'popupRoot';
  const [hasClosed, setHasClosed] = React.useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <PopupProvider>
        <OpenPopupButton id={id} />
        <PopupPanel
          id={id}
          deleteRootOnUnmount
          onClose={() => setHasClosed(true)}
        >
          <PopupContentWrap id={id} title="example popup">
            Hello I'm open!
          </PopupContentWrap>
        </PopupPanel>
        <PopupPanelDebug />
      </PopupProvider>
      <p>{hasClosed ? 'Has been closed' : 'Has not been closed'}</p>
    </div>
  );
};

export const PopupPanelUnmountOnHide = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const id = 'popupRootUnMountOnHide';

  return (
    <div className="">
      <div className="">
        <button
          type="button"
          className={isOpen ? 'button-one' : 'button-two'}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? 'unmount' : 'mount'}
        </button>
        <PopupProvider>
          <OpenPopupButton id={id} />
          {isOpen && (
            <PopupPanel id={id} deleteRootOnUnmount>
              <PopupContentWrap id={id}>Hello I'm open!</PopupContentWrap>
            </PopupPanel>
          )}
          <PopupPanelDebug />
        </PopupProvider>
      </div>
    </div>
  );
};

export const BasicPopupPanelManaged = () => {
  const id = 'popupRootManaged';
  const [open, setOpen] = React.useState(false);
  const [hasClosed, setHasClosed] = React.useState(false);

  const handleClose = () => {
    setHasClosed(true);
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <div style={{ position: 'relative' }}>
      <PopupProvider>
        <button onClick={handleOpen}>Open</button>
        <PopupPanelManaged id={id} isOpen={open} onClose={handleClose}>
          <div
            style={{
              position: 'absolute',
              width: '10rem',
              height: '10rem',
              right: '0',
              background: 'grey',
            }}
          >
            <p>Hello I'm open!</p>
            <button onClick={handleClose}>Close popup</button>
          </div>
        </PopupPanelManaged>
      </PopupProvider>
      <p>{hasClosed ? 'Has been closed' : 'Has not been closed'}</p>
      <p>{open ? 'Is open' : 'Is closed'}</p>
    </div>
  );
};

const Content = ({ foo, handleClose }) => {
  return (
    <div
      style={{
        position: 'absolute',
        width: '10rem',
        height: '10rem',
        right: '0',
        background: 'grey',
      }}
    >
      <p>Hello I'm open!</p>
      <button onClick={handleClose}>Close from the inside</button>
    </div>
  );
};

const PopupConnected = (
  props: Omit<
    React.ComponentProps<typeof PopupPanelManagedWithContentWrap>,
    'children'
  > & { foo: string }
) => {
  return (
    <PopupPanelManagedWithContentWrap {...props} title="Product Editor">
      <Content {...props} handleClose={props.onClose} />
    </PopupPanelManagedWithContentWrap>
  );
};

export const BasicPopupPanelManagedB = () => {
  const id = 'popupRootManaged';
  const [open, setOpen] = React.useState(false);
  const [hasClosed, setHasClosed] = React.useState(false);

  const handleClose = () => {
    setHasClosed(true);
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <div style={{ position: 'relative' }}>
      <PopupProvider>
        <button onClick={handleOpen}>Open</button>
        <PopupConnected
          title="lkjkj"
          id={id}
          isOpen={open}
          onClose={handleClose}
          foo="lkjlkjlkj"
        />
      </PopupProvider>
      <p>{hasClosed ? 'Has been closed' : 'Has not been closed'}</p>
      <p>{open ? 'Is open' : 'Is closed'}</p>
    </div>
  );
};
