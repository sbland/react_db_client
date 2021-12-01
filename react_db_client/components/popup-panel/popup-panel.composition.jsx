import React, { useEffect, useState } from 'react';
import { PopupPanel } from './popup-panel';

export const BasicPopupPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [popupRoot, setPopupRoot] = useState(null);
  useEffect(() => {
    // TODO: Fix getting popup root
    const __popupRoot = document.createElement('div');
    __popupRoot.setAttribute('id', 'popup-root');
    const _popupRoot = document.getElementById('popup-root');
  }, []);
  if (!popupRoot) return <div>Loading</div>;
  return (
    <div className="">
      <div className="">
        <button
          type="button"
          className={isOpen ? 'button-one' : 'button-two'}
          onClick={() => setIsOpen(true)}
        >
          Open
        </button>
        <PopupPanel
          isOpen={isOpen}
          handleClose={() => {
            setIsOpen(false);
          }}
          popupRoot={popupRoot}
        >
          <div className="" style={{ background: 'red' }}>
            Hello
          </div>
        </PopupPanel>
      </div>
    </div>
  );
};
