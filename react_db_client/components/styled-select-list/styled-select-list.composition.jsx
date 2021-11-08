import React from 'react';
import { StyledSelectList } from './styled-select-list';


// eslint-disable-next-line import/no-extraneous-dependencies
import { demoListInputData, demoHeadingsData, demoListInputDataLong } from './inputDataShapes';

export const BasicStyledSelectList = () => (
  <StyledSelectList
    listInput={demoListInputData}
    headings={demoHeadingsData}
    handleSelect={(id) => alert(`Selected: ${id}`)}
  />
);


export const StyledSelectListLong = () => (
  <StyledSelectList
    listInput={demoListInputDataLong}
    headings={demoHeadingsData}
    handleSelect={(id) => alert(`Selected: ${id}`)}
  />
)

export const StyledSelectListScroll = () => (
  <StyledSelectList
    listInput={demoListInputDataLong}
    headings={demoHeadingsData}
    handleSelect={(id) => alert(`Selected: ${id}`)}
    limitHeight
  />
)