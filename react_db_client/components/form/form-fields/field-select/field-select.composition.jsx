import React from 'react';
import { CompositionWrapDefault } from '@samnbuk/react_db_client.helpers.composition-wraps';
import { FieldSelect } from './field-select';
import { defaultVal, demoOptions } from './demo-data';

const updateFormData = () => {};

const defaultProps = {
  uid: 'uid',
  unit: 'unit',
  value: defaultVal,
  options: demoOptions,
  updateFormData,
};

export const BasicFieldSelect = () => (
  <CompositionWrapDefault height="4rem" width="8rem">
    <FieldSelect {...defaultProps} required />
  </CompositionWrapDefault>
);
