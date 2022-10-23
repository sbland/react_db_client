import styled from 'styled-components';

export const SelectionPreviewList = styled.ul`
  border-radius: 3px;
  border: 1px solid #eeeeee;
  padding: 1rem * 0.2;
  list-style: none;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: stretch;
  overflow-y: scroll;
  @media (min-width: 768px) {
    flex-direction: column;
    flex-wrap: wrap;
    align-content: stretch;
    overflow-y: auto;
  }
`;

export const SelectionPreviewListItem = styled.li`
  line-height: 0.8rem;
  display: flex;
`;

export const SelectionPreviewLabelStyle = styled.div`
  min-width: 6rem;
  padding-right: 0.2rem;
`;

export const SelectionPreviewLabelWrapStyle = styled.label`
  font-weight: 800;
`;

export const SelectionPreviewValueStyle = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
