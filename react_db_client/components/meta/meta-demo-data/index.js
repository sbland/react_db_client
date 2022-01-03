import React from 'react';

export const demoTemplateData = {
  _id: 'demoTemplateData',
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
  uid: 'pageid',
  data: {
    fa: 'value a',
  },
  datatype: {
    uid: demoDatatype.uid,
    label: demoDatatype.label,
    template: demoTemplateData._id,
  },
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

export const asyncGetDocument = async (c, i) => {
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

export const asyncGetDocuments = async (c, i) => {
  switch (c) {
    case 'fields':
      return Object.values(demoFieldsData);
    default:
      throw Error(`Not mocked: ${c}: ${i}`);
  }
};

export const demoField = ({ viewMode, uid, value = '', updateFormData }) =>
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
      {value}
    </div>
  );

export const componentMap = {
  text: () => demoField,
};

// export const defaultProps = {
//   viewMode: 'view',
//   pageData: demoPageData.data,
//   datatypeData: demoDatatype,
//   templateData: demoTemplateData,
//   fieldsData: demoFieldsData,
//   hideMissing: false,
//   updateFormData: (field, value) => console.log(`${field}:${value}`),
//   componentMap,
// };
