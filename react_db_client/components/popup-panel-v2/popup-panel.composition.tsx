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
  const id = 'popup';
  return (
    <div style={{ position: 'relative' }}>
      <PopupProvider>
        <OpenPopupButton id={id} />
        <PopupPanel id={id}>
          <ExamplePanel>hello world!</ExamplePanel>
        </PopupPanel>
      </PopupProvider>
    </div>
  );
};
