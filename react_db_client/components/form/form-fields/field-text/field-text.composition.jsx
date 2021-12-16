import React, { useState } from 'react';
import { FieldText } from './field-text';

export const BasicFieldText = () => (
  <FieldText
    uid="id"
    unit="UNIT"
    updateFormData={(k, v) => alert(`Changed: ${k}, val: ${v}`)}
    value="hello from FieldText"
  />
);

export const FieldTextManaged = () => {
  const [state, setState] = useState({ id: 'Hello world' });
  const uid = 'id';
  return (
    <FieldText
      uid={uid}
      unit="UNIT"
      updateFormData={(k, v) => setState((prev) => ({ ...prev, [k]: v }))}
      value={state[uid]}
    />
  );
};
