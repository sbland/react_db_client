import styled from 'styled-components';

// $unit: 1rem; //var(--unit, 1rem);
// 1rem:1rem; // (--core-line-height, 1.2rem);

export const SearchFieldWrapStyle = styled.div`
  display: flex;
  min-height: 1rem;
  position: relative;
`;
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
  line-height: 1rem;
  animation: spin 1s infinite linear;
  width: 1.5rem;
  font-size: 1rem;
  display: block;
  text-align: center;
  font-size: 1rem;
  font-weight: 400;
`;

export const SasDropWrap = styled.div`
  width: 100%;
  position: relative;
  &.invalid {
    .searchField {
      color: red;
    }
  }
`;

export const SasDropLoadingWrap = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;
export const DropdownBtn = styled.button`
  position: absolute;
  right: 3px;
  top: 3px;
  bottom: 3px;
  width: 1.5rem;
  text-align: center;
  border: none;
  background: none;
`;
