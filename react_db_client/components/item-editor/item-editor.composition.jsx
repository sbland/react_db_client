import React from 'react';
import { ItemEditor } from './item-editor';
import { demoParams, demoData } from './demo-data';
import { defaultComponentMap } from '@react_db_client/components.form.form';

const asyncGetDocuments = async () => {
  throw Error('Not Implemented');
};
const fileServerUrl = '';
const onSubmitCallback= () => {};

export const BasicItemEditor = () => (
  <div className="productEditor_FormWrap sectionWrapper">
    <ItemEditor
      id="demo-id"
      inputUid="abc"
      isNew={false}
      onSubmitCallback={onSubmitCallback}
      additionalData={{}}
      params={demoParams}
      collection="democollection"
      asyncGetDocument={async () => demoData}
      asyncPutDocument={async () => {}}
      asyncPostDocument={async () => {}}
      asyncDeleteDocument={async () => {}}
      componentMap={defaultComponentMap({ asyncGetDocuments, fileServerUrl })}
    />
  </div>
);
