import React from 'react';
import { CompositionWrapDefault } from '@samnbuk/react_db_client.helpers.composition-wraps';

import { FieldNumber } from './field-number';

export const BasicFieldNumber = () => (
  <CompositionWrapDefault height="4rem" width="4rem">
    <FieldNumber
      uid="foo"
      unit="unit"
      min={0}
      max={10}
      step={0.1}
      defaultValue={3}
      updateFormData={() => {}}
      value={4}
      required
    />
  </CompositionWrapDefault>
);
