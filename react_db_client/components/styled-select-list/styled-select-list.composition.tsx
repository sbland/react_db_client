import React from 'react';
import { CompositionWrapDefault } from '@react_db_client/helpers.composition-wraps';
import { StyledSelectList } from './styled-select-list';

// eslint-disable-next-line import/no-extraneous-dependencies
import { demoListInputData, demoHeadingsData, demoListInputDataLong } from './dummy-data';

export const BasicStyledSelectList = () => (
  <CompositionWrapDefault height="20rem" width="40rem">
    <StyledSelectList
      listInput={demoListInputData}
      headings={demoHeadingsData}
      handleSelect={(id) => alert(`Selected: ${id}`)}
    />
  </CompositionWrapDefault>
);

export const StyledSelectListLong = () => (
  <CompositionWrapDefault height="20rem" width="40rem">
    <StyledSelectList
      listInput={demoListInputDataLong}
      headings={demoHeadingsData}
      handleSelect={(id) => alert(`Selected: ${id}`)}
    />
  </CompositionWrapDefault>
);

export const StyledSelectListScroll = () => (
  <CompositionWrapDefault height="20rem" width="40rem">
    <StyledSelectList
      listInput={demoListInputDataLong}
      headings={demoHeadingsData}
      handleSelect={(id) => alert(`Selected: ${id}`)}
      limitHeight={30}
    />
  </CompositionWrapDefault>
);

export const StyledSelectListSelected = () => (
  <CompositionWrapDefault height="20rem" width="40rem">
    <StyledSelectList
      listInput={demoListInputData}
      headings={demoHeadingsData}
      handleSelect={(id) => alert(`Selected: ${id}`)}
      limitHeight={30}
      currentSelection={[demoListInputData[0].uid]}
    />
  </CompositionWrapDefault>
);
