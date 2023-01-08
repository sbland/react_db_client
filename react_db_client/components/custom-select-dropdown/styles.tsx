import styled from 'styled-components';

import { defaultTheme } from '@react_db_client/constants.style';

export const SelectDropdown = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  min-width: ${({ theme }) => theme.reactDbClientTheme.select.menu.minWidth};
`;

SelectDropdown.defaultProps = {
  theme: {
    reactDbClientTheme: defaultTheme,
  },
};
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
    min-height: ${({ theme }) => theme.reactDbClientTheme.typography.lineHeight};
    max-height: calc(${({ theme }) => theme.reactDbClientTheme.typography.lineHeight} * 8.5);
  }
`;

SelectDropdownList.defaultProps = {
  theme: {
    reactDbClientTheme: defaultTheme,
  },
};
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
    min-height: ${({ theme }) => theme.reactDbClientTheme.typography.lineHeight};
    max-height: calc(${({ theme }) => theme.reactDbClientTheme.typography.lineHeight} * 8.5);
    border: ${({ theme }) => theme.reactDbClientTheme.select.menu.border};
    border-top: none;
    overflow: auto;
    pointer-events: all;
    box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.1);
  }
`;

SelectDropdownMenu.defaultProps = {
  theme: {
    reactDbClientTheme: defaultTheme,
  },
};
export const SelectDropwdownItem = styled.li`
  width: 100%;
  height: ${({ theme }) => theme.reactDbClientTheme.typography.lineHeight};
  button {
    height: ${({ theme }) => theme.reactDbClientTheme.typography.lineHeight};
    line-height: ${({ theme }) => theme.reactDbClientTheme.typography.lineHeight};
    font-size: ${({ theme }) => theme.reactDbClientTheme.typography.fontSize};
    pointer-events: all;
    cursor: pointer;
    margin: 0;
    width: 100%;
    border-radius: 0;
    border: none;
    border-bottom: 1px grey solid;
    min-width: 4rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
    overflow: hidden;

    ${({ theme }) => theme.reactDbClientTheme.select.item.default}
    &:focus {
      ${({ theme }) => theme.reactDbClientTheme.select.item.onFocus}
    }
    &:hover {
      ${({ theme }) => theme.reactDbClientTheme.select.item.onHover}
    }
  }
`;

SelectDropwdownItem.defaultProps = {
  theme: {
    reactDbClientTheme: defaultTheme,
  },
};
export const DropdownBtn = styled.button`
  position: absolute;
  margin: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: $unit * 1.5;
  text-align: center;
  border: none;
  background: none;
  line-height: ${({ theme }) => theme.reactDbClientTheme.typography.lineHeight}
  font-size: ${({ theme }) => theme.reactDbClientTheme.typography.fontSize}

  &:focus {
    ${({ theme }) => theme.reactDbClientTheme.buttons.onFocus}
  }
  &:hover {
    ${({ theme }) => theme.reactDbClientTheme.buttons.onHover}
  }
`;

DropdownBtn.defaultProps = {
  theme: {
    reactDbClientTheme: defaultTheme,
  },
};
