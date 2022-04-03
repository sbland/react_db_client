import React, { useState } from 'react';
import { PopupPanel, PopupPanelConnector } from './popup-panel';

export const BasicPopupPanel = () => {
  const [isOpen, setIsOpen] = useState(false);

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
          id="demo-id"
          isOpen={isOpen}
          handleClose={() => {
            setIsOpen(false);
          }}
          popupRoot="root"
        >
          <div className="" style={{ background: 'red' }}>
            Hello
          </div>
        </PopupPanel>
      </div>
    </div>
  );
};

const DemoInnerComponent = (props) => {
  return <div>Hello</div>;
};
const WrappedComponent = PopupPanelConnector(DemoInnerComponent, 'root', true, 'onCancel');

export const PopupPanelConnectorDemo = () => {
  const [isOpen, setIsOpen] = useState(false);

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
        {isOpen && <WrappedComponent onCancel={() => setIsOpen(false)} />}
      </div>
    </div>
  );
};
