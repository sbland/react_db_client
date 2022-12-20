import styled from 'styled-components';
import { ButtonStyled } from '@react_db_client/constants.style';

export const FileUploaderSelectButton = styled(ButtonStyled)`
  * {
    margin-right: 1rem;
  }
`;

export const FileUploaderButtonsWrap = styled.div`
  display: flex;
  justify-content: stretch;
  width: 100%;
  margin-bottom: 1rem;

  & > * {
    margin-right: 1rem;
    flex-grow: 1;
  }
`;

export const FileUploadBtn = styled(ButtonStyled)`
  // pointer-events: none;
`