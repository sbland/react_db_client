import React from 'react';
import { CompositionWrapDefault } from '@samnbuk/react_db_client.helpers.composition-wraps/dist';
import { FieldFile } from './field-file';
import { defaultVal } from './demo-data';

const updateFormData = () => {};

const defaultProps = {
  uid: 'uid',
  unit: 'unit',
  value: defaultVal,
  updateFormData,
};


export const BasicFieldFile  = () => (
  <CompositionWrapDefault height="4rem" width="8rem">
    <FieldFile
      {...defaultProps}
      required
    />
  </CompositionWrapDefault>
);
