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
    <div role="textbox" aria-readonly="true" aria-labelledby={uid}>
      {value}
    </div>
  );

const componentMap = {
  text: () => demoField,
};

export const demoPageData = {
  uid: 'demo_page',
  datatype: demoDatatype,
  data: {
    fa: 'value a',
  },
};
