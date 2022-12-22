import { defaultTheme } from '@react_db_client/constants.style';
import styled from 'styled-components';

// $unit: 1rem; //var(--unit, 1rem);
// 1rem:1rem; // (--core-line-height, 1.2rem);

export const SearchFieldWrapStyle = styled.div`
  display: flex;
  min-height: 1rem;
  position: relative;
`;

SearchFieldWrapStyle.defaultProps = {
  theme: {
    reactDbClientTheme: defaultTheme,
  },
};
// @keyframes twist-up {
//   to {
//     transform: rotateX(360deg);
//   }
// }

export const LoadingIconStyle = styled.div`
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  position: absolute;
  top: 3px;
  right: 3px;
  line-height: ${({ theme }) => theme.reactDbClientTheme.typography.lineHeight};
  animation: spin 1s infinite linear;
  width: ${({ theme }) => theme.reactDbClientTheme.typography.lineHeight};
  font-size: ${({ theme }) => theme.reactDbClientTheme.typography.fontSize};
  display: block;
  text-align: center;
  font-weight: 400;
`;

LoadingIconStyle.defaultProps = {
  theme: {
    reactDbClientTheme: defaultTheme,
  },
};

export const SasDropWrap = styled.div`
  width: 100%;
  position: relative;
  &.invalid {
    .searchField {
      color: red;
    }
  }
`;

SasDropWrap.defaultProps = {
  theme: {
    reactDbClientTheme: defaultTheme,
  },
};

export const SasDropLoadingWrap = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

SasDropLoadingWrap.defaultProps = {
  theme: {
    reactDbClientTheme: defaultTheme,
  },
};

export const DropdownBtn = styled.button`
  position: absolute;
  right: 3px;
  top: 3px;
  bottom: 3px;
  width: ${({ theme }) => theme.reactDbClientTheme.typography.lineHeight};
  text-align: center;
  border: none;
  background: none;
  margin: 0;
  line-height: ${({ theme }) => theme.reactDbClientTheme.typography.lineHeight};

  &:focus {
    ${({ theme }) => theme.reactDbClientTheme.button.onFocus}
  }
  &:hover {
    ${({ theme }) => theme.reactDbClientTheme.button.onHover}
  }
`;

DropdownBtn.defaultProps = {
  theme: {
    reactDbClientTheme: defaultTheme,
  },
};
