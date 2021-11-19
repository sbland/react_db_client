import React from 'react';
import { FieldNumber } from './field-number';

export const BasicFieldNumber = () => (
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
);
