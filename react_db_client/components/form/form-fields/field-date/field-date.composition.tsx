import React from 'react';
import { defaultVal } from './demo-data';
import { FieldDate } from './field-date';

export const BasicFieldDate = () => (
  <FieldDate
    uid="foo"
    unit="unit"
    // defaultValue={defaultVal}
    updateFormData={() => {}}
    value={defaultVal}
    required
  />
);
