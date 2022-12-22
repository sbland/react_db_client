import React from 'react';
import { ItemEditor } from './item-editor';
import { demoParams, demoData } from './demo-data';
import { defaultComponentMap } from '@form-extendable/components.component-map';
import { Form, FormField } from '@form-extendable/component';
import { defaultTheme, FormThemeProvider } from '@form-extendable/styles';

const asyncGetFiles = () => async () => {
  return [];
};
const fileServerUrl = '';
const onSubmitCallback = () => {};
const Popup = ({ children, isOpen = true || undefined }) => {
  if (isOpen) return <>{children}</>;
  return <></>;
};

const componentMap = defaultComponentMap({ asyncGetFiles, fileServerUrl, PopupPanel: Popup });

export const BasicItemEditor = () => (
  <FormThemeProvider theme={defaultTheme}>
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
  </FormThemeProvider>
);

export const TestForm = () => {
  return (
    <FormThemeProvider theme={defaultTheme}>
      <Form
        formDataInitial={{}}
        headings={demoParams}
        onSubmit={() => {}}
        onChange={() => {}}
        showEndBtns
        submitBtnText="Save Item"
        componentMap={componentMap}
        FormField={FormField}
      />
    </FormThemeProvider>
  );
};
