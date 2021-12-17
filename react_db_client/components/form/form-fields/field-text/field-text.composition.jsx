import React, { useState } from 'react';
import {
  CompositionWrapDefault,
  WrapFieldComponent,
} from '@samnbuk/react_db_client.helpers.composition-wraps';
import { FieldText } from './field-text';

export const BasicFieldText = () => (
  <CompositionWrapDefault height="4rem" width="16rem">
    <WrapFieldComponent>
      <FieldText
        uid="id"
        unit="UNIT"
        updateFormData={(k, v) => alert(`Changed: ${k}, val: ${v}`)}
        value="hello from FieldText"
      />
    </WrapFieldComponent>
  </CompositionWrapDefault>
);
