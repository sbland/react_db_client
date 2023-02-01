/* This file was created as a initial conversion of sass to styled-components */

import styled from 'styled-components';

// TODO: Replace #777771 with primary color

export const StyledListStyle = styled.div`
  z-index: 1; // Stops the scroll bar jumping on top of popups
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  overflow: auto;
  padding-bottom: 0.2rem;
`;

export const StyledListHeadingStyle = styled.div`
  border-bottom: 4px #bbbbbb double;
  margin-bottom: 1rem * 0.4;
  display: flex;
  z-index: 10;
`;

export interface IStyledListItemsProps {
  limitHeight?: boolean;
}

export const StyledListItems = styled.ul<IStyledListItemsProps>`
  list-style: none;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  overflow: auto;
  margin: 0;
  padding: 0;
  .styledList_itemBtn {
    overflow: none;
  }
  ${({ limitHeight }) =>
    limitHeight
      ? `
    overflow: auto;
    .styledList_itemBtn {
      overflow: none;
    }
    `
      : ''}
`;

export interface IStyledListItemBtnStyleProps {
  selected?: boolean;
}

export const StyledListItemStyle = styled.li<IStyledListItemBtnStyleProps>`
  width: 100%;
  margin: 0;
  padding: 0;
  max-height: 1rem * 2;
  overflow: visible;
  &:not(:last-child) {
    button {
      // border: 1px #eeeeee solid;
      border-bottom: 2px #eeeeee solid;
    }
  }
`;

export const StyledListItemBtnStyle = styled.button<IStyledListItemBtnStyleProps>`
  border: none;
  margin: 0;
  padding: 0;
  display: flex;
  max-height: 1rem * 2;

  &.styledList_itemBtnSelected {
    &:not(:last-child) {
      border: 1px #eeeeee solid;
      border-bottom: 2px #eeeeee solid;
    }
    // TODO: Replace all this with styled-component theme
    div {
      color: #ddd;
      background: #555;
    }
    &:hover {
      div {
        background: #333;
      }
    }
  }
`;

/* TODO: Implement styled-component setup */
// ${({ selected, theme }) =>
//   selected
//     ? `
//       border: none;
//       &:not(:last-child) {
//         border: 1px #eeeeee solid;
//         border-bottom: 2px #eeeeee solid;
//       }

//       padding: 0;
//       display: flex;
//       max-height: 1rem * 2;
//       color: ${() => theme?.colors?.cta || 'white'};
//       background: ${() => theme?.colors?.cta || '#333'};

//       div {
//         color: ${() => theme?.colors?.cta || 'white'};
//         background: ${() => theme?.colors?.cta || '#333'};
//       }
//       `
//     : ''}

StyledListItemBtnStyle.defaultProps = {
  theme: {
    selectedBackground: 'blue',
  },
};

export const StyledSelectListHeadingStyle = styled.div`
  font-weight: 800;
  &:not(:last-child) {
    border-right: 1px #eeeeee solid;
  }
`;

export interface IStyledSelectListItemCellProps {
  selected?: boolean;
}

export const StyledListItemCell = styled.div<IStyledSelectListItemCellProps>`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-overflow: ellipsis;
  max-height: 1rem * 2;
  font-size: 0.8rem;
  line-height: 1.1rem;
  background: none;
  &:not(:last-child) {
    border-right: 1px #eeeeee solid;
  }
  ${({ selected }) =>
    selected
      ? `
  color: white;
    background: #777771;
  `
      : ''}
`;
