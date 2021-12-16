import React from 'react';
import { CompositionWrapDefault } from '@samnbuk/react_db_client.helpers.composition-wraps';

import { FieldNumber } from './field-number';
import { defaultProps } from './default-val';

export const BasicFieldNumber = () => (
  <CompositionWrapDefault height="4rem" width="4rem">
    <FieldNumber {...defaultProps} />
  </CompositionWrapDefault>
);
