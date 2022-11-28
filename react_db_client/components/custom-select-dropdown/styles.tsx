import styled from 'styled-components';

const listItemHeight = '1.5rem';
const minDropdownListWidth = '8rem';
const primaryColourLight = 'grey';

export const SelectDropdown = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  min-width: ${minDropdownListWidth};
`;

export const SelectDropdownList = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  max-height: 0;
  margin: 0;
  padding: 0;
  overflow: auto;
  z-index: 11;

  transition: max-height 0.3s ease;
  display: none;
  &.open {
    display: initial;
    min-height: ${listItemHeight};
    max-height: calc(${listItemHeight} * 8.5);
  }
`;

export const SelectDropdownMenu = styled.div`
  position: absolute;
  width: 100%;
  background: white;
  z-index: 10;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s ease;
  &.open {
    display: initial;
    min-height: ${listItemHeight};
    max-height: calc(${listItemHeight} * 8.5);
    border: 1px solid ${primaryColourLight};
    border-top: none;
    overflow: auto;
    pointer-events: all;
    box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.1);
  }
`;

export const SelectDropwdownItem = styled.li`
  width: 100%;
  height: ${listItemHeight};
  button {
    height: ${listItemHeight};
    pointer-events: all;
    width: 100%;
    border-radius: 0;
    border: none;
    border-bottom: 1px grey solid;
    min-width: 4rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
    overflow: hidden;
    &:focus {
      background-color: ${primaryColourLight};
    }
  }
`;

export const DropdownBtn = styled.button`
  position: absolute;
  right: 3px;
  top: 3px;
  bottom: 3px;
  width: $unit * 1.5;
  text-align: center;
  border: none;
  background: none;
`;
