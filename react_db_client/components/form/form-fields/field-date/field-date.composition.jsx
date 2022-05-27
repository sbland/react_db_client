import React from 'react';
import { CompositionWrapDefault } from '@react_db_client/helpers.composition-wraps';

import { defaultVal } from './demo-data';
import { FieldDate } from './field-date';

export const BasicFieldDate = () => (
  <CompositionWrapDefault height="4rem" width="4rem">
    <FieldDate
      uid="foo"
      unit="unit"
      // defaultValue={defaultVal}
      updateFormData={() => {}}
      value={defaultVal}
      required
    />
  </CompositionWrapDefault>
);
