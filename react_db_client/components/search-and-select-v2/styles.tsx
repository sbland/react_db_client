import styled from 'styled-components';

export const SearchAndSelectStyles = styled.div`
  .searchAndSelect_filterList {
    list-style: none;
  }

  .searchAndSelect_filterItem {
    .searchAndSelect_filterItem {
      margin-left: 1rem;
    }

    label {
      margin-right: 1rem;
    }
  }

  .searchAndSelect {
    position: relative;
  }

  .sas_loadingWrap {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: rgba(255, 255, 255, 0.4);
    z-index: 200;
    text-align: center;
    opacity: 1;
    min-height: (10 * 1rem);

    transition: opacity 0.3s ease-in;

    * {
      position: absolute;
      top: 45%;
      left: 0;
      right: 0;
      font-size: 3em;
    }

    &.hidden {
      transition: opacity 0.5s ease;
      opacity: 0;
      pointer-events: none;
    }
  }

  .selectionPreview_listWrap {
    border-radius: 3px;
    border: 1px solid grey;
    padding: 1rem * 0.2;
    list-style: none;
  }
`;
