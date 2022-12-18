import React from 'react';
import { ItemEditor } from './item-editor';
import { demoParams, demoData } from './demo-data';
import { defaultComponentMap } from '@form-extendable/components.component-map';

const asyncGetFiles = () => async () => {
  return [];
};
const fileServerUrl = '';
const onSubmitCallback = () => {};
const Popup = ({ children, isOpen = true || undefined }) => {
  if (isOpen) return <>{children}</>;
  return <></>;
};

const componentMap =  defaultComponentMap({ asyncGetFiles, fileServerUrl, PopupPanel: Popup })

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
      componentMap={componentMap}
    />
  </div>
);
