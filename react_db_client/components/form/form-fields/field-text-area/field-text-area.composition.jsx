import React from 'react';
import { CompositionWrapDefault } from '@samnbuk/react_db_client.helpers.composition-wraps/dist';
import { FieldTextArea } from './field-text-area';
import { defaultVal } from './demo-data';

const updateFormData = () => {};

const defaultProps = {
  uid: 'uid',
  unit: 'unit',
  value: defaultVal,
  updateFormData,
};

export const BasicFieldTextArea = () => (
  <CompositionWrapDefault height="4rem" width="16rem">
    <FieldTextArea {...defaultProps} required />
  </CompositionWrapDefault>
);
