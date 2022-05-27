import React, { useState } from 'react';
import { CompositionWrapDefault } from '@react_db_client/helpers.composition-wraps';
import { demoResults } from './demo-data';
import { FieldObjectRef } from './field-object-ref';

export const BasicFieldObjectRef = () => {
  const [value, setValue] = useState(null);
  const updateFormData = (uid, newVal) => {
    console.log(uid);
    console.log(newVal);
    setValue(newVal);
  };
  return (
    <div>
      <CompositionWrapDefault height="4rem" width="4rem">
        <FieldObjectRef
          uid="demoid"
          unit="demounit"
          updateFormData={updateFormData}
          value={value}
          multiple={false}
          required={false}
          labelField="label"
          collection="democollection"
          asyncGetDocuments={async (collection, filters, schema, sortBy) => demoResults}
          allowEmptySearch
        />
      </CompositionWrapDefault>
      Value: {value && value.label}
    </div>
  );
};

export const Multiple = () => {
  const [value, setValue] = useState(null);
  const updateFormData = (uid, newVal) => {
    console.log(uid);
    console.log(newVal);
    setValue(newVal);
  };
  return (
    <div>
      <CompositionWrapDefault height="4rem" width="4rem">
        <FieldObjectRef
          uid="demoid"
          unit="demounit"
          updateFormData={updateFormData}
          value={value}
          multiple
          required={false}
          labelField="label"
          asyncGetDocuments={async (collection, filters, schema, sortBy) => demoResults}
          allowEmptySearch
          collection="democollection"
        />
      </CompositionWrapDefault>
      {value && value.map((v) => v.label)}
    </div>
  );
};

export const MultipleAltLabel = () => {
  const [value, setValue] = useState(null);
  return (
    <CompositionWrapDefault height="4rem" width="4rem">
      <FieldObjectRef
        uid="demoid"
        unit="demounit"
        updateFormData={alert}
        value={value}
        multiple
        required={false}
        labelField="name"
        asyncGetDocuments={async (collection, filters, schema, sortBy) => demoResults}
        allowEmptySearch
        collection="democollection"
      />
    </CompositionWrapDefault>
  );
};
