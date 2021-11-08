import React from 'react';
import { FieldText } from './field-text';

export const BasicFieldText = () => (
  <FieldText
    uid="id"
    unit="UNIT"
    updateFormData={(k, v) => alert(`Changed: ${k}, val: ${v}`)}
    value="hello from FieldText"
  />
);
