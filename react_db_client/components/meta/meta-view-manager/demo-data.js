import React from 'react';

export const demoDatatype = {
  uid: 'demo_datatype',
  label: 'Demo Datatype',
};

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
    <div role="textbox" aria-readonly="true" aria-labelledby={uid}>{value}</div>
  );

const componentMap = {
  text: () => demoField,
};

export const demoPageData = {
  fa: 'value a',
};


const asyncGetDocument = async (c, i) => {
  switch (c) {
    case 'pages':
      return demoPageData;
    case 'datatypes':
      return demoDatatype;
    case 'templates':
      return demoTemplateData;
    case 'fields':
      return demoFieldsData;
    default:
      throw Error(`Not mocked: ${c}: ${i}`);
  }
};

const asyncGetDocuments = async (c, i) => {
  switch (c) {
    case 'fields':
      return demoFieldsData;
    default:
      throw Error(`Not mocked: ${c}: ${i}`);
  }
};


export const defaultProps = {
  inputUid: 'DemoId',
  datatypeId: demoDatatype.uid,
  isNew: false,
  additionalData: {},
  onSubmitCallback: () => {},
  asyncGetDocuments,
  asyncGetDocument,
  asyncPutDocument: async () => {},
  asyncPostDocument: async () => {},
  asyncDeleteDocument: async () => {},
  componentMap,
};
