import React, { useState } from 'react';
import { PopupPanel } from './popup-panel';

export const BasicPopupPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="">
      <div className="" id="popup-root">
        -
      </div>
      <div className="">
        <button type="button" className="button-one" onClick={() => {}}>
          Open
        </button>
        <PopupPanel
          isOpen={isOpen}
          handleClose={() => {
            setIsOpen(false);
          }}
        >
          <div className="">Hello</div>
        </PopupPanel>
      </div>
    </div>
  );
};
