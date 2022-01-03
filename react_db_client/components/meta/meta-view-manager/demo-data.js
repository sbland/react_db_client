import {
  demoPageData,
  demoDatatype,
  asyncGetDocument,
  asyncGetDocuments,
  componentMap,
} from '@samnbuk/react_db_client.components.meta.meta-demo-data';


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
