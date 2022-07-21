import styled from 'styled-components';

export const DefaultTextStyle = styled.div`
  && {
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: ${({ theme }) => theme.typography.fontSize4};
    line-height: ${({ theme }) => theme.typography.fontSize4};
  }
`;

export const DefaultInputStyle = styled.input`
  flex-grow: 1;
  height: '100%';
`;

export const DefaultTextAreaStyle = styled.textarea`
  position: absolute;
  width: 100%;
  min-height: 5rem;
  min-width: 20rem;
  left: 0;
  top: 0;
  white-space: normal;
  resize: none;
  z-index: 10;
  overflow: hidden;
`;

const focusedBoxShadow = '1px 1px 10px 0 grey';

export const DefaultCellInnerStyle = styled.div`
  flex-grow: 1;

  // display: ${({ focused }) => (focused ? 'block' : 'flex')};
  display: flex;
  z-index: ${({ focused }) => (focused ? 10 : 0)};
  // box-shadow: ${({ focused }) => (focused ? focusedBoxShadow : 'none')};
  align-items: stretch;
  justify-content: center;

  padding: ${({ theme }) => theme.cellPadding};
  box-sizing: border-box;
  min-height: 100%;
  min-width: 100%;
  height: ${({ focused }) => (focused ? 'fit-content' : '100%')};
  width: ${({ focused }) => (focused ? 'fit-content' : '100%')};

  // outline: ${({ focused, theme }) =>
    focused ? `1px solid ${theme.primaryColor || 'red'}` : 'none'};

  outline-offset: -1px;
  font-size: ${(props) => props.theme.typography?.fontSize4};
  line-height: ${(props) => props.theme.typography?.fontSize4};

  * {
    font-size: ${(props) => props.theme.typography?.fontSize4};
    line-height: ${(props) => props.theme.typography?.fontSize4};
  }

  .cellInput-number {
    height: 100%;
    width: 100%;
    padding: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const Text = styled(DefaultTextStyle)`
  text-align: center;
`;

export const Number = styled(DefaultTextStyle)`
  text-align: left;
`;

export const FocusedText = styled(Text)`
  &&& {
    text-align: left;
    // TODO: enable resize
    // resize: auto;
    overflow: hidden;
  }
`;

export const FocusedTextLong = styled(Text)`
  && {
    text-align: left;
    overflow: hidden;
    white-space: normal;
    resize: auto;
  }
`;


export const CellStyle = styled.div`
  && {
    width: 100%;
    height: 100%;
    position: relative;
    &:focus {
      outline: none;
    }
  }
`;

export const NavigationButtonStyle = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 20;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  &:focus {
    outline: none;
  }
`;

export const CellStyles = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  text-align: center;

  .dataTableCell_wrap {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`;
