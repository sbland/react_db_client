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

const demoField = ({ viewMode, uid, value='', updateFormData }) =>
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
    <div id={uid} aria-readonly="true" aria-labelledby={uid}>
      {value }
    </div>
  );

export const componentMap = {
  text: () => demoField,
};

export const demoPageData = {
  datatype: demoDatatype,
  uid: 'demoPage',
  data: {
    fa: 'value a',
  },
};

const asyncGetDocument = async (c, i) => {
  switch (c) {
    case 'pages':
      return demoPageData;
    case 'datatypes':
      return demoDatatype;
    case 'templates':
      return demoTemplateData;
    default:
      throw Error(`Not mocked: ${c}: ${i}`);
  }
};

const asyncGetDocuments = async (c, i) => {
  switch (c) {
    case 'fields':
      return Object.values(demoFieldsData);
    default:
      throw Error(`Not mocked: ${c}: ${i}`);
  }
};

export const defaultProps = {
  inputUid: demoPageData.uid,
  datatypeId: demoDatatype.uid,
  isNew: false,
  additionalData: {},
  onSubmitCallback: () => {},
  asyncGetDocuments,
  asyncGetDocument,
  asyncPutDocument: async (collection, uid, data) => console.log(data),
  asyncPostDocument: async () => {},
  asyncDeleteDocument: async () => {},
  componentMap,
};
