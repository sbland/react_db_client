import {
  demoPageData,
  demoDatatype,
  demoTemplateData,
  demoFieldsData,
  componentMap,
} from '@samnbuk/react_db_client.components.meta.meta-demo-data';

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
