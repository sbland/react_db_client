import React, { useCallback, useMemo, useState } from 'react';
import { filterTypes } from '@samnbuk/react_db_client.constants.client-types';
import { FormField } from './FormField';
import { defaultComponentMap } from './default-component-map';

const componentMap = defaultComponentMap({});
const demoHeading = {
  uid: 'id',
  type: filterTypes.text,
  label: 'Label',
};
export const BasicFormField = () => {
  const [state, setState] = useState({ id: 'Hello world' });

  const updateFormData = useCallback((k, v) => setState((prev) => ({ ...prev, [k]: v })), []);
  return (
    <FormField
      heading={demoHeading}
      value={state[demoHeading.uid]}
      updateFormData={updateFormData}
      additionalData={{}}
      componentMap={componentMap}
    />
  );
};
