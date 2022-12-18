import React from 'react';
// import { PopupPanel } from '@react_db_client/components.popup-panel';
import { IItemEditorProps, ItemEditor } from '@react_db_client/components.item-editor';
import { GenericCatalogue, IGenericCatalogueProps } from './generic-catalogue';
import { PopupPanel, PopupPanelConnector } from '@react_db_client/components.popup-panel';

import { demoHeadingsData, demoHeadingsDataSimple, demoResults } from './demo-data';
import { IDocument } from '@react_db_client/constants.client-types';
import { defaultComponentMap } from '@form-extendable/components.component-map';

const ItemEditorPopup = PopupPanelConnector(ItemEditor, 'root', true, 'onCancel', {
  title: 'Demo Item Editor',
});
const PopupPanelConnected = (props) => <PopupPanel popupRoot="root" {...props} />;

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

const defaultProps: IGenericCatalogueProps<IDocument> = {
  id: 'demo-id',
  itemName: 'Demo Item',
  collection: 'DEMO COLLECTION',
  additionalFilters: [],
  availableFilters: {},
  resultsHeadings: demoHeadingsDataSimple,
  previewHeadings: demoHeadingsDataSimple,
  editorHeadings: demoHeadingsData,
  additionalSaveData: {},
  ItemEditor: ItemEditorPopup,
  PopupPanel: PopupPanelConnected,
  notificationDispatch: alert,
  asyncGetDocument: async () => Object.values(demoResults)[0],
  asyncGetDocuments: async () => Object.values(demoResults),
  asyncPutDocument: async () => alert('Put doc'),
  asyncPostDocument: async () => alert('Post doc'),
  asyncDeleteDocument: async () => {},
  asyncCopyDocument: async () => {},
  // asyncDeleteDocuments: async () => alert('Deleted DOcument'),
  componentMap,
  // onError: () => {},
};

export const BasicGenericCatalogue = () => <GenericCatalogue {...defaultProps} />;

// const popupRoot = document.createElement('div', { id: 'popup-root' });
// const _PopupItemEditor = (props: IItemEditorProps<IDocument>) => (
//   // <PopupPanel isOpen handleClose={() => setShowEditor(false)} popupRoot={popupRoot}>
//   <ItemEditor {...props} />
//   // </PopupPanel>
// );

// export const PopupItemEditor = () => (
//   <GenericCatalogue {...defaultProps} ItemEditor={_PopupItemEditor} />
// );
