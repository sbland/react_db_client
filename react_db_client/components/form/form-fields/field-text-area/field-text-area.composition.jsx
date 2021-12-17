import React, { useState } from 'react';
import { CompositionWrapDefault, WrapFieldComponent } from '@samnbuk/react_db_client.helpers.composition-wraps';
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

export const FieldTextAreaMultiple = () => (
  <CompositionWrapDefault height="4rem" width="16rem">
    <FieldTextArea {...defaultProps} required />
    <FieldTextArea {...defaultProps} required />
    <FieldTextArea {...defaultProps} required />
  </CompositionWrapDefault>
);

export const FieldTextAreaMultipleHoriz = () => {
  return (
    <CompositionWrapDefault height="4rem" width="16rem">
      <div style={{ display: 'flex' }}>
        <WrapFieldComponent>
          <FieldTextArea {...defaultProps} required />
          <FieldTextArea {...defaultProps} required />
          <FieldTextArea {...defaultProps} required />
        </WrapFieldComponent>
      </div>
    </CompositionWrapDefault>
  );
};
