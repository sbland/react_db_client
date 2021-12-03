import React from 'react';
import { CompositionWrapDefault } from '@samnbuk/react_db_client.helpers.composition-wraps';

import { FieldMultiSelect } from './field-multi-select';
import { demoOptions } from './demo-data';

export const BasicFieldMultiSelect = () => (
  <CompositionWrapDefault height="4rem" width="4rem">
    <FieldMultiSelect
      uid="foo"
      unit="unit"
      updateFormData={() => {}}
      options={demoOptions}
      value={[demoOptions[0].uid]}
      required
    />
  </CompositionWrapDefault>
);

export const Dropdown = () => (
  <CompositionWrapDefault height="4rem" width="4rem">
    <FieldMultiSelect
      uid="foo"
      unit="unit"
      updateFormData={() => {}}
      options={demoOptions}
      value={[demoOptions[0].uid]}
      required
      asDropdown
    />
  </CompositionWrapDefault>
);

export const HideUnselected = () => (
  <CompositionWrapDefault height="4rem" width="4rem">
    <FieldMultiSelect
      uid="foo"
      unit="unit"
      updateFormData={() => {}}
      options={demoOptions}
      value={[demoOptions[0].uid]}
      required
      selectType="hideunselected"
    />
  </CompositionWrapDefault>
);

export const Showall = () => (
  <CompositionWrapDefault height="4rem" width="4rem">
    <FieldMultiSelect
      uid="foo"
      unit="unit"
      updateFormData={() => {}}
      options={demoOptions}
      value={[demoOptions[0].uid]}
      required
      selectType="showall"
    />
  </CompositionWrapDefault>
);
