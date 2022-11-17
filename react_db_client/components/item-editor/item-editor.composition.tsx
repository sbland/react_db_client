import React from 'react';
import { ItemEditor } from './item-editor';
import { demoParams, demoData } from './demo-data';
import { defaultComponentMap } from '@form-extendable/components.component-map';

const asyncGetFiles = () => async () => {
  throw Error('Not Implemented');
};
const fileServerUrl = '';
const onSubmitCallback = () => {};

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
      componentMap={defaultComponentMap({ asyncGetFiles, fileServerUrl })}
    />
  </div>
);
