import styled from 'styled-components';

export const BubbleSelectorListStyle = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;

  li {
    margin-right: (1rem * 0.5);
    margin-bottom: (1rem * 0.1);
  }

  &.unselected {
    max-height: (1rem * 8);
    overflow-y: auto;
  }
`;

export const BubbleSelectorListItemStyle = styled.li`
  button {
    border-radius: (1rem * 0.2);
    min-width: (1rem * 4);
  }
`;
