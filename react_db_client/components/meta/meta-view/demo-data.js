import React from 'react';

export const demodataDatatype = {
  uid: 'demo_datatype',
  label: 'Demo Datatype',
};

export const demoTemplateData = {
  sidebar: {},
  main: {
    a: {
      uid: 'a',
      label: 'a',
      fields: [
          'fa',
          'fb',
      ],
    },
    b: {
      uid: 'b',
      label: 'b',
      fields: [],
    },
  },
};

export const demoFieldsData = {
    fa: {
        uid: 'fa',
        label: 'Fa',
        ftype: 'text',
    },
    fb: {
        uid: 'fb',
        label: 'Fb',
        ftype: 'text',
    },
}

const componentMap = {
    'text': () => () => <div>Text</div>
}

export const defaultProps = {
  viewMode: 'view',
  pageData: {},
  datatypeData: demodataDatatype,
  templateData: demoTemplateData,
  fieldsData: demoFieldsData,
  hideMissing: false,
  handleEditFormChange: () => {},
  componentMap,
};
