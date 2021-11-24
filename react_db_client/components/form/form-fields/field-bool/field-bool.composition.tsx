import React from 'react';
import { CompositionWrapDefault } from '@samnbuk/react_db_client.helpers.composition-wraps';

import { FieldBool } from './field-bool';

export const BasicFieldBool  = () => (
  <CompositionWrapDefault height="4rem" width="4rem">
    <FieldBool
      uid="foo"
      updateFormData={() => {}}
      value
      required
    />
  </CompositionWrapDefault>
);
