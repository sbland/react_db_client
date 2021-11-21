import React from 'react';
import { FieldMultiSelect } from './field-multi-select';
import { demoOptions } from './demo-data';

export const BasicFieldMultiSelect = () => (
  <FieldMultiSelect
    uid="foo"
    unit="unit"
    updateFormData={() => {}}
    options={demoOptions}
    value={[demoOptions[0].uid]}
    required
  />
);



export const Dropdown = () => (
  <FieldMultiSelect
    uid="foo"
    unit="unit"
    updateFormData={() => {}}
    options={demoOptions}
    value={[demoOptions[0].uid]}
    required
    asDropdown
  />
);



export const HideUnselected = () => (
  <FieldMultiSelect
    uid="foo"
    unit="unit"
    updateFormData={() => {}}
    options={demoOptions}
    value={[demoOptions[0].uid]}
    required
    selectType="hideunselected"
  />
);

export const Showall = () => (
  <FieldMultiSelect
    uid="foo"
    unit="unit"
    updateFormData={() => {}}
    options={demoOptions}
    value={[demoOptions[0].uid]}
    required
    selectType="showall"
  />
);
