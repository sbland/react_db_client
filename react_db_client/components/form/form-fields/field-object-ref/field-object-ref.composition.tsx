import React from 'react';
import { FieldObjectRef } from './field-object-ref';


const defaultProps = {
  uid: 'demoid',
  unit: 'demounit',
  updateFormData: () => {},
  handleSelect: () => {},
  value: 'inputValue',
  multiple: false,
  required: false,
  returnFieldOnSelect: 'uid',
  searchFieldTargetField: 'name',
  labelField: 'name',
  searchFn: (collection, schema, sortBy) => async(filters) => {},
};

export const BasicFieldObjectRef  = () => (
  <FieldObjectRef {...defaultProps} />
);
