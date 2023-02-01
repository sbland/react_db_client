import React from 'react';
import { PopupPanel } from './popup-panel';
import {
  EPopupRegisterAction,
  PopupPanelContext,
  PopupProvider,
} from './popup-panel-provider';
import { PopupContentWrap } from './popup-panel-content-wrap';
import { PopupPanelManagedWithContentWrap } from './managed-popup-panel';

const OpenPopupButton = ({ id }) => {
  const { openPopup } = React.useContext(PopupPanelContext);
  return (
    <button
      onClick={() => {
        openPopup(id);
      }}
    >
      Open
    </button>
  );
};

const PopupPanelDebug = () => {
  const {
    state: { popupRegister },
  } = React.useContext(PopupPanelContext);

  return <>{JSON.stringify(popupRegister)}</>;
};

const ExampleContent = ({
  id,
  manualClose,
}: {
  id: string | number;
  manualClose?: () => void;
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        width: '10rem',
        height: '10rem',
        right: '0',
        background: 'grey',
      }}
      data-testid={`${id}_contentInner`}
    >
      <p>Hello I'm open!</p>
      {manualClose && (
        <button onClick={manualClose}>Close Externally Button</button>
      )}
    </div>
  );
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
            <ExampleContent id={id} />
          </PopupContentWrap>
        </PopupPanel>
        <PopupPanelDebug />
      </PopupProvider>
      <p>{hasClosed ? 'Has been closed' : 'Has not been closed'}</p>
    </div>
  );
};

const Counter = ({ id }) => {
  const renderCounter = React.useRef(0);
  const {
    state: { popupRegister },
    dispatchPopupRegister,
  } = React.useContext(PopupPanelContext);
  renderCounter.current = renderCounter.current + 1;
  return (
    <div>
      <p data-testid={`counter_${id}`}>{renderCounter.current}</p>
      <button
        onClick={() => {
          dispatchPopupRegister({
            type: EPopupRegisterAction.OPEN_POPUP,
            args: 1,
          });
        }}
      >
        DummyButton
      </button>
    </div>
  );
};

// const PopupPanelInner = ({ id }) => {
//   const { openPopup, closePopup } = React.useContext(PopupPanelContext);
//   return (
//     <PopupPanel id={id} deleteRootOnUnmount>
//       <PopupContentWrap id={id} title="example popup">
//         <ExampleContent id={id} manualClose={() => closePopup(id)} />
//         <button onClick={() => openPopup(1)}>DummyButton</button>
//       </PopupContentWrap>
//     </PopupPanel>
//   );
// };

// export const BasicPopupPanelExtFuncs = () => {
//   const id = 'popupRootExtFuncs';
//   // const [hasClosed, setHasClosed] = React.useState(false);
//   return (
//     <div style={{ position: 'relative' }}>
//       <PopupProvider>
//         <Counter id="1" />
//         <OpenPopupButton id={id} />
//         {/* <OpenPopupButtonExt id={id} /> */}
//         <PopupPanelInner id={id} />
//         <PopupPanelDebug />
//       </PopupProvider>
//       {/* <p>{hasClosed ? 'Has been closed' : 'Has not been closed'}</p> */}
//     </div>
//   );
// };

export const PopupPanelUnmountOnHide = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const id = 'popupRootUnMountOnHide';

  return (
    <div>
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
            <PopupContentWrap id={id}>
              <ExampleContent id={id} />
            </PopupContentWrap>
          </PopupPanel>
        )}
        <PopupPanelDebug />
      </PopupProvider>
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
        <PopupPanelManagedWithContentWrap
          title="ExampleEditor"
          id={id}
          isOpen={open}
          onClose={handleClose}
        >
          <ExampleContent id={id} manualClose={() => setOpen(false)} />
        </PopupPanelManagedWithContentWrap>
      </PopupProvider>
      <p>{hasClosed ? 'Has been closed' : 'Has not been closed'}</p>
      <p>{open ? 'Is open' : 'Is closed'}</p>
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
    <PopupPanelManagedWithContentWrap {...props} title="Example Editor">
      <ExampleContent {...props} manualClose={props.onClose} />
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
