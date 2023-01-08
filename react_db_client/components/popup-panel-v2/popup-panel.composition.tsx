import React from 'react';
import { PopupPanel } from './popup-panel';
import { PopupPanelContext, PopupProvider } from './popup-panel-provider';
import { PopupContentWrap } from './default-popup-panel-wrap';

const OpenPopupButton = ({ id }) => {
  const { openPopup } = React.useContext(PopupPanelContext);
  return <button onClick={() => openPopup(id)}>Open</button>;
};

export const BasicPopupPanel = () => {
  const id = 'popupRoot';
  const [hasClosed, setHasClosed] = React.useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <PopupProvider>
        <OpenPopupButton id={id} />
        <PopupPanel id={id} deleteRootOnUnmount onClose={() => setHasClosed(true)}>
          <PopupContentWrap id={id} title="example popup">
            Hello I'm open!
          </PopupContentWrap>
        </PopupPanel>
      </PopupProvider>
      <p>{hasClosed ? 'Has been closed' : 'Has not been closed'}</p>
    </div>
  );
};

export const PopupPanelUnmountOnHide = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const id = 'popupRoot';

  return (
    <div className="">
      <div className="">
        <button
          type="button"
          className={isOpen ? 'button-one' : 'button-two'}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          Open
        </button>
        <PopupProvider>
          {isOpen && (
            <PopupPanel id={id} deleteRootOnUnmount>
              <PopupContentWrap id={id}>Hello I'm open!</PopupContentWrap>
            </PopupPanel>
          )}
        </PopupProvider>
      </div>
    </div>
  );
};
