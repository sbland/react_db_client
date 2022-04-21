import styled from 'styled-components';

export const DefaultCellInnerStyle = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2em;
  box-sizing: border-box;

  height: 100%;
  width: 100%;

  font-size: ${(props) => props.theme.typography.fontSize4};
  line-height: ${(props) => props.theme.typography.fontSize4};

  * {
    font-size: ${(props) => props.theme.typography.fontSize4};
    line-height: ${(props) => props.theme.typography.fontSize4};
  }

  .dataTableCellData_text,
  .dataTableCellData_number {
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .dataTableCellData_number {
    text-align: left;
  }

  .dataTableCellData_text {
    text-align: center;
  }

  .cellInput-number {
    height: 100%;
    width: 100%;
    padding: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  // form {
  //     width: 100%;
  //     select {
  //         width: 100%;
  //     }
  // }
`;
