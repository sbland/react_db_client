import styled from 'styled-components';

export const MultiSelectDropdownStyles = styled.div`
  .multiSelectDropdown {
    // display: flex;
  }

  .multiSelectDropdown_list-selected,
  .multiSelectDropdown_list-unselected {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    margin-right: (-(1rem * 0.5));
    margin-bottom: (-(1rem * 0.5));

    li {
      margin-right: (1rem * 0.5);
      margin-bottom: (1rem * 0.5);
    }
  }

  .multiSelectDropdown_list-unselected {
    max-height: (1rem * 8);
    overflow-y: auto;
  }

  .multiSelectDropdown_list-selected {
    float: right;
    margin-left: 1rem;
  }

  .multiSelectDropdown_menu {
    position: absolute;
    background: white;
    border: 1px #ddd solid;
    padding: 1rem;
    z-index: 10;
  }

  .multiSelectDropdown_item {
    button {
      border-radius: (1rem * 0.2);
      min-width: (1rem * 4);
    }
  }
`;
