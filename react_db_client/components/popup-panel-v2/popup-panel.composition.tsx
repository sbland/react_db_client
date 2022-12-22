import React from 'react';
import styled from 'styled-components';
import { PopupPanel } from './popup-panel';
import { PopupPanelContext, PopupProvider } from './popup-panel-provider';

const OpenPopupButton = ({ id }) => {
  const { openPopup } = React.useContext(PopupPanelContext);
  return <button onClick={() => openPopup(id)}>Open</button>;
};

const ExamplePanel = styled.div`
  background: grey;
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;
`;

export const BasicPopupPanel = () => {
  const id = 'popupRoot';
  return (
    <div style={{ position: 'relative' }}>
      <PopupProvider>
        <OpenPopupButton id={id} />
        <PopupPanel id={id} deleteRootOnUnmount>
          <ExamplePanel>Hello I'm open!</ExamplePanel>
        </PopupPanel>
      </PopupProvider>
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
          {/* <OpenPopupButton id={id} /> */}
          {isOpen && (
            <PopupPanel id={id} deleteRootOnUnmount>
              <ExamplePanel>Hello I'm open!</ExamplePanel>
            </PopupPanel>
          )}
        </PopupProvider>
      </div>
    </div>
  );
};
