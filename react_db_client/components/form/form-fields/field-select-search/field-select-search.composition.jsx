import React from 'react';
import { CompositionWrapDefault } from '@samnbuk/react_db_client.helpers.composition-wraps';
import { FieldSelectSearch } from './field-select-search';
import { defaultVal, demoOptions } from './demo-data';

const updateFormData = () => {};
const searchFn = async () => demoOptions;

const defaultProps = {
  uid: 'demoid',
  unit: 'demounit',
  updateFormData,
  value: defaultVal,
  multiple: false,
  required: false,
  searchFn,
  returnFieldOnSelect: 'uid',
  searchFieldTargetField: 'label',
  labelField: 'label',
};

export const BasicFieldSelectSearch = () => (
  <CompositionWrapDefault height="4rem" width="8rem">
    <FieldSelectSearch {...defaultProps} required />
  </CompositionWrapDefault>
);
