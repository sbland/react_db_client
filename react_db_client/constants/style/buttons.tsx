import styled from 'styled-components';

export const ButtonStyled = styled.button`
  cursor: pointer;
  margin: 0;
  padding: 0;
  border: none;
  ${({ theme }) => theme.reactDbClientTheme.button.default}

  &:focus {
    ${({ theme }) => theme.reactDbClientTheme.button.onFocus}
  }
  &:hover {
    ${({ theme }) => theme.reactDbClientTheme.button.onHover}
  }
`;

export const CTAButtonStyled = styled(ButtonStyled)`
  ${({ theme }) => theme.reactDbClientTheme.ctabutton.default}

  &:focus {
    ${({ theme }) => theme.reactDbClientTheme.ctabutton.onFocus}
  }
  &:hover {
    ${({ theme }) => theme.reactDbClientTheme.ctabutton.onHover}
  }
`;
