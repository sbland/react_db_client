import styled from 'styled-components';
import { EViewTypes } from './lib';

export interface IItemListViewTypeProps {
  viewType: EViewTypes;
}

export const ItemListStyle = styled.ul<IItemListViewTypeProps>`
  list-style: none;
  display: flex;
  margin-right: -$unit;
  flex-wrap: wrap;

  margin: 1px;

  // item bottom margin needs to be offset flex item margin
  margin-bottom: -$unit;

  ${({ viewType }) => {
    switch (viewType) {
      case EViewTypes.LIST:
        return `
        flex-direction: column;
        margin-bottom: 0rem;
      `;
      default:
        break;
    }
  }}
`;

export interface IItemWrapStyleProps {
  selected: boolean;
}

export const ItemWrapStyle = styled.li<IItemWrapStyleProps & IItemListViewTypeProps>`
  position: relative;
  width: ($unit * 15);
  max-width: ($unit * 20);
  height: ($unit * 11);
  border: 1px $grey-40 solid;
  margin-bottom: $unit;
  border-radius: 4px;
  box-shadow: 1px 1px 20px 0px rgba(100, 100, 100, 0.05);
  overflow: hidden;

  &:not(:last-child) {
    margin-right: $unit;
  }
  border: ${({ selected }) => (selected ? 'border: 4px $primaryColour solid' : 'none')};

  &:hover {
    box-shadow: 1px 1px 10px 0px rgba(100, 100, 100, 0.2);
    .itemList_overlay {
      button {
        opacity: 1;
      }
    }
  }

  ${({ viewType }) => {
    switch (viewType) {
      case EViewTypes.LIST:
        return `
        height: 3rem;
        padding: 1px;
        margin-bottom: 0.3rem;
     `;
      default:
        break;
    }
  }}
`;

export const ItemStyle = styled.div`
  height: 100%;
  width: 100%;
  color: $grey-60;
  background: $grey-10;
  a,
`;
export const ItemButtonStyle = styled.button`
  /* Button reset */
  cursor: pointer;
  text-decoration: none;
  background: transparent;
  border: none;
  text-align: left;
  line-height: $core_line-height;

  padding: 0;
  margin: 0;

  &:focus {
    outline: $focus_outline;
    outline-offset: $focus_offset;
  }
  /* Button style */

  * {
    font-weight: 800;
    font-size: $font-size-2;
  }
  width: 100%;
  height: 100%;

  display: block;
  width: 100%;
  height: 100%;
  padding: $unit;

  &:hover {
    background: rgba(231, 231, 231, 0.2);
  }
`;

export const ItemImageStyle = styled.img`
  min-width: 100%;
  min-height: 100%;
  margin: auto;
  border: 3px solid $grey-40;
`;

export const OverlayStyle = styled.div<IItemListViewTypeProps>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;

  padding: $unit;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  button {
    opacity: 0;
    pointer-events: auto;
    // flex-grow: 1;
    padding: 0;
    margin-bottom: 0.2 * $unit;
    // width: 100%;
    width: 1.5 * $unit;
    height: 1.7 * $unit;
    border-radius: 3px;

    transition: width 0.2s ease-out, opacity 0.2s ease;
    overflow: hidden;

    &:hover {
      width: 5 * $unit;
      height: 1.8 * $unit;
    }
  }

  ${({ viewType }) => {
    switch (viewType) {
      case EViewTypes.LIST:
        return `
        padding: 0;
     `;
      default:
        break;
    }
  }}
`;
