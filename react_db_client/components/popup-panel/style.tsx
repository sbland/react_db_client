import styled from 'styled-components';

export const PopupPanelWrapStyle = styled.div`
  position: fixed;

  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow-y: auto;
`;

export const PopupPanelStyle = styled.div`
  position: fixed;
  left: 1rem;
  right: 1rem;
  top: 1rem;
  bottom: 1rem;
  background: #fafafa;
  z-index: 10;

  padding: 2rem;
  border: 1px #333 solid;
  height: 95%;
`;

export const PopupPanelOverlay = styled.div`
  position: fixed;
  opacity: 0.4;
  cursor: pointer;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAMElEQVQImXXJsREAIAwDMS/kZX47b0sFByQpVElAOrajKYCaO0re8eQfJ7sAoimALAAwSVfRiD/CAAAAAElFTkSuQmCC)
    repeat;
`;

export const PopupPanelCloseBtn = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  top: -10px;
  border-radius: 10px;
  border: none;
`;

export const PopupPanelContentStyle = styled.div`
  margin-bottom: 1rem;
  position: absolute;
  overflow-y: auto;
  top: 2rem;
  right: 0;
  left: 0;
  bottom: 0;
  padding: 1rem;
  background: #fafafa;
  section {
    background: #fafafa;
    &:not(:last-child) {
      margin-bottom: 0.2rem;
    }
  }
`;

export const PopupPanelTopBar = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 2rem;
  background: #fafafa;
`;

export const PopupPanelTitle = styled.div`
  margin-left: 1rem;
  color: #bbbbbb;
`;
