import styled from 'styled-components';

export const PopupMenuWrapStyle = styled.div`
  position: absolute;

  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999;
`;

export const PopupMenuStyle = styled.div`
  background: white;
  z-index: 10;

  position: absolute;
  box-shadow: 1px 1px 20px 10px rgba(100, 100, 100, 0.15);
`;

export const PopupMenuListStyle = styled.ul`
  list-style: none;
  margin: 0;
  border-radius: 5px;
`;

export const PopupMenuListItemStyle = styled.li`
  //
`;
export const PopupMenuListItemButtonStyle = styled.button`
  width: 100%;
  background: white;

  padding: (1rem * 0.5) 1rem;

  &:hover {
    background: #bbbbbb;
  }
`;

export const PopupMenuRightClickWrapStyle = styled.div`
  width: 100%;
  height: 100%;

  &.active {
    border: 1px #cccccc dashed;
  }
`;

export const PopupMenuOverlayStyle = styled.div`
  position: absolute;
  opacity: 0.4;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;
