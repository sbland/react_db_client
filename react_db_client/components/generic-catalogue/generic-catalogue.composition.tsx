import React from 'react';
import { ItemEditor } from '@react_db_client/components.item-editor';
import { GenericCatalogue, IGenericCatalogueProps } from './generic-catalogue';
import { PopupPanelConnector } from '@react_db_client/components.popup-panel';
import { IDocument } from '@react_db_client/constants.client-types';
import { defaultComponentMap } from '@form-extendable/components.component-map';
import { demoHeadingsData, demoHeadingsDataSimple, demoResults } from './demo-data';

const ItemEditorPopup = PopupPanelConnector(ItemEditor, 'root', true, 'onCancel', {
  title: 'Demo Item Editor',
});

const asyncGetFiles = () => async () => {
  return [];
};
const fileServerUrl = '';
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
  notificationDispatch: alert,
  asyncGetDocument: async () => Object.values(demoResults)[0],
  asyncGetDocuments: async () => Object.values(demoResults),
  asyncPutDocument: async () => alert('Put doc'),
  asyncPostDocument: async () => alert('Post doc'),
  asyncDeleteDocument: async () => {},
  asyncCopyDocument: async () => {},
  componentMap,
  // onError: () => {},
};

export const BasicGenericCatalogue = () => <GenericCatalogue {...defaultProps} />;
