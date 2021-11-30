import React from 'react';
import { ItemEditor } from './item-editor';
import { demoParams, demoData } from './demo-data';

export const BasicItemEditor = () => (
  <div className="productEditor_FormWrap sectionWrapper">
    <ItemEditor
      inputUid="abc"
      isNew={false}
      onSubmitCallback={() => {}}
      additionalData={{}}
      params={demoParams}
      collection="democollection"
      asyncGetDocument={async () => demoData}
      asyncPutDocument={async () => {}}
      asyncPostDocument={async () => {}}
      asyncDeleteDocument={async () => {}}
    />
  </div>
);
