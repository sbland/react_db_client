import styled from 'styled-components';

export interface IPopupProps {
  isOpen: boolean;
}

export const PopupPanelWrapStyle = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  margin: 0;
  padding: 0;
`;

export const PopupPanelClosePanelStyle = styled.button`
  position: absolute;
  cursor: pointer;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  min-width: 100%;
  text-decoration: none;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;

  &:focus {
    outline: none;
  }
  &:hover {
    background-color: transparent;
  }
`;

export const PopupPanelContentPanelStyle = styled.div<IPopupProps>`
  width: 0;
  height: 0;
  pointer-events: none;
  & > * {
    pointer-events: initial;

    @keyframes expand {
      0% {
        transform: scale(90%);
      }
      100% {
        transform: scale(100%);
      }
    }

    @keyframes contract {
      0% {
        transform: scale(110%);
      }
      100% {
        transform: scale(100%);
      }
    }
    animation: ${({ isOpen }) =>
      isOpen ? '0.15s ease-out 0s 1 expand' : '0.15s ease-out 0s 1 contract'};
  }
`;
