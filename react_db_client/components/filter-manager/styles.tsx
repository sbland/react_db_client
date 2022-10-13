import styled from 'styled-components';

export const FilterPanelStyle = styled.div`

`

export const FilterListStyle = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const FilterListItemStyle = styled.li`
  padding: 0;
  margin: 0;
  display: flex;
`;

export const FilterListHeadingsStyle = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

export const FilterListColumnStyle = styled.div`
  // border: 1px solid red;
  margin-right: 0.5rem;
`;

export const FilterListColumnBtns = styled(FilterListColumnStyle)`
  width: 5%;
  min-width: 4rem;
`;

export const FilterListColumnField = styled(FilterListColumnStyle)`
  width: 30%;
  min-width: 4rem;
  select {
    width: 100%;
  }
`;

export const FilterListColumnOperator = styled(FilterListColumnStyle)`
  width: 40%;
  min-width: 4rem;
  select {
    width: 100%;
  }
`;

export const FilterListColumnValue = styled(FilterListColumnStyle)`
  width: 40%;
  min-width: 4rem;
`;
