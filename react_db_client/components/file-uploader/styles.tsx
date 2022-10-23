import styled from 'styled-components';

export const FileUploaderSelectButton = styled.button`
  padding: (1rem * 0.3);
  cursor: pointer;
  text-align: center;
  * {
    margin-right: 1rem;
    &:not(:last-child) {
      margin-right: 1rem;
    }
  }
`;

export const FileUploaderButtonsWrap = styled.div`
  display: flex;
  justify-content: stretch;
  width: 100%;
  margin-bottom: 1rem;

  & > * {
    margin-right: $unit;
    flex-grow: 1;
  }
`;
