import React from 'react';
import { filterTypes } from '@samnbuk/react_db_client.constants.client-types';
import { FormField } from './FormField';
import { Form } from './form';
import { FormInputs } from './FormInputs';

import { demoHeadingsData, demoFormData, demoAdditionalData } from './DemoData';
import { defaultComponentMap } from './default-component-map';

const asyncGetDocuments = async () => {
  throw Error('Not implemented');
};

const fileServerUrl = '';

// export const BasicForm = () => (
//   <Form
//     headings={[
//       {
//         uid: 'foo',
//         label: 'Foo',
//         type: 'text',
//       },
//     ]}
//     onSubmit={({ formEditData, formData }) => {}}
//     onChange={() => {}}
//     componentMap={{
//       text: () => 'placeholder text',
//     }}
//   />
// );

const DemoFormField = ({ heading }) => {
  return <div>{heading?.label}</div>;
};

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
const DemoFormComponent = ({ uid, label, updateFormData, value, required, additionalData }) => {
  const { customFieldStyle } = additionalData;
  return <div style={customFieldStyle}>Custom Form Component</div>;
};

/**
 * Default form using preset form field component
 */
export const FormDefault = () => {
  return (
    <div className="sectionWrapper">
      <Form
        headings={demoHeadingsData}
        formDataInitial={demoFormData}
        onSubmit={(data) => console.log(data)}
        additionalData={demoAdditionalData}
        componentMap={defaultComponentMap({ asyncGetDocuments, fileServerUrl })}
        FormField={FormField}
      />
    </div>
  );
};

/**
 * Default form with horizontal orientation
 */
export const FormDefaultHoriz = () => {
  return (
    <div className="sectionWrapper">
      <Form
        headings={demoHeadingsData}
        formDataInitial={demoFormData}
        onSubmit={(data) => console.log(data)}
        additionalData={demoAdditionalData}
        componentMap={defaultComponentMap({ asyncGetDocuments, fileServerUrl })}
        FormField={FormField}
        orientation="horiz"
      />
    </div>
  );
};

export const FormDefaultCustomFieldComponent = () => {
  return (
    <div className="sectionWrapper">
      <Form
        headings={demoHeadingsData}
        formDataInitial={demoFormData}
        onSubmit={(data) => console.log(data)}
        additionalData={demoAdditionalData}
        componentMap={{
          demoFieldType: () => DemoFormComponent,
        }}
        FormField={DemoFormField}
      />
    </div>
  );
};

export const FormFields = () => {
  return (
    <FormInputs
      headings={demoHeadingsData}
      formData={demoFormData}
      updateFormData={(uid, value) => console.log(`uid: ${uid} value: ${value}`)}
      FormField={DemoFormField}
    />
  );
};

export const FormNested = () => {
  return (
    <FormInputs
      headings={[
        { uid: 'name', label: 'Name', type: filterTypes.text },

        {
          uid: 'embeddedb',
          label: 'Embedded B',
          type: filterTypes.embedded,
          orientation: 'horiz',
          children: [
            {
              uid: 'embeddedtog1',
              label: 'Embedded Tog1',
              type: filterTypes.text,
            },
            {
              uid: 'embeddedtog2',
              label: 'Embedded Tog2',
              type: filterTypes.text,
            },
            {
              uid: 'embeddedtog3',
              label: 'Embedded Tog3',
              type: filterTypes.text,
            },
          ],
        },
        {
          uid: 'embeddedb',
          label: 'Embedded Horiz wrap',
          type: filterTypes.embedded,
          orientation: 'horiz',
          children: [
            {
              uid: 'embedded2',
              label: 'Embedded left',
              type: filterTypes.embedded,
              orientation: 'vert',
              children: [
                { uid: 'hello', label: 'Hello', type: filterTypes.text },
                { uid: 'foo', label: 'foo', type: filterTypes.text },
                { uid: 'bar', label: 'bar', type: filterTypes.text },
              ],
            },
            {
              uid: 'embedded2',
              label: 'Embedded right',
              type: filterTypes.embedded,
              orientation: 'vert',
              children: [
                { uid: 'hellob', label: 'Hello', type: filterTypes.text },
                { uid: 'foob', label: 'foo', type: filterTypes.text },
                { uid: 'barb', label: 'bar', type: filterTypes.text },
              ],
            },
          ],
        },

        {
          uid: 'embedded2',
          label: 'Embedded Vert',
          type: filterTypes.embedded,
          orientation: 'vert',
          children: [
            { uid: 'hello', label: 'Hello', type: filterTypes.text },
            { uid: 'foo', label: 'foo', type: filterTypes.text },
            { uid: 'bar', label: 'bar', type: filterTypes.text },
          ],
        },
      ]}
      formData={demoFormData}
      updateFormData={(uid, value) => console.log(`uid: ${uid} value: ${value}`)}
      FormField={DemoFormField}
    />
  );
};
