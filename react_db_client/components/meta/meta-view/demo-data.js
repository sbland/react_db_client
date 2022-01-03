import React from 'react';


export const demoTemplateData = {
  sidebar: {},
  main: {
    a: {
      uid: 'a',
      label: 'a',
      fields: ['fa', 'fb'],
    },
    b: {
      uid: 'b',
      label: 'b',
      fields: [],
    },
  },
};


export const demoDatatype = {
  uid: 'demo_datatype',
  label: 'Demo Datatype',
  template: demoTemplateData,
};


export const demoPageData = {
  data: {
    fa: 'value a',

  },
  datatype: {
    uid: demoDatatype.uid,
    label: demoDatatype.label,
  }
};


export const demoFieldsData = {
  fa: {
    _id: 'fa',
    label: 'Fa',
    ftype: 'text',
  },
  fb: {
    _id: 'fb',
    label: 'Fb',
    ftype: 'text',
  },
};

const demoField = ({ viewMode, uid, value, updateFormData }) =>
  viewMode === 'edit' ? (
    <input
      type="text"
      role="textbox"
      name={uid}
      aria-labelledby={uid}
      value={value}
      onChange={(e) => updateFormData(uid, e.target.value)}
    />
  ) : (
    <div id={uid} aria-readonly="true" aria-labelledby={uid}>{value}</div>
  );

export const componentMap = {
  text: () => demoField,
};

export const defaultProps = {
  viewMode: 'view',
  pageData: demoPageData.data,
  datatypeData: demoDatatype,
  templateData: demoTemplateData,
  fieldsData: demoFieldsData,
  hideMissing: false,
  updateFormData: (field, value) => console.log(`${field}:${value}`),
  componentMap,
};
