import React from 'react';
import { FieldReadOnly } from './field-read-only';
import { filterTypes } from '@react_db_client/constants.client-types';

export const BasicFieldReadOnly = () => (
  <FieldReadOnly
    value="hello from FieldReadOnly"
    unit="TEXT"
    type={filterTypes.text}
    options={[]}
  />
);
