import React from 'react';
import { PopupPanel } from '@samnbuk/react_db_client.components.popup-panel';
import { ItemEditor } from '@samnbuk/react_db_client.components.item-editor';
import { GenericCatalogue } from './generic-catalogue';

import { demoHeadingsData, demoHeadingsDataSimple, demoResults } from './demo-data';

const defaultProps = {
  itemName: 'Demo Item',
  collection: 'DEMO COLLECTION',
  additionalFilters: [],
  availableFilters: {},
  resultsHeadings: demoHeadingsDataSimple,
  editorHeadings: demoHeadingsData,
  additionalSaveData: {},
  ItemEditor: () => <div>ITEM EDITOR PLACEHOLDER</div>,
  apiDeleteDocuments: async () => alert('Deleted DOcument'),
  PopupPanel: ({ children, isOpen }) => (isOpen ? children : ''),
  notificationDispatch: alert,
  asyncGetDocument: async() => Object.values(demoResults)[0],
  asyncGetDocuments: async () => Object.values(demoResults),
  asyncPutDocument: async() => alert('Put doc'),
  asyncPostDocument: async() => alert('Post doc'),
  asyncDeleteDocument: async() => {},
  customFieldComponents: {},
  onError: () => {},
};

export const BasicGenericCatalogue = () => <GenericCatalogue {...defaultProps} />;

const popupRoot = document.createElement('div', {id: 'popup-root'});
const _PopupItemEditor = (props) => (
  // <PopupPanel isOpen handleClose={() => setShowEditor(false)} popupRoot={popupRoot}>
    <ItemEditor {...props} />
  // </PopupPanel>
);

export const PopupItemEditor = () => (
  <GenericCatalogue {...defaultProps} ItemEditor={_PopupItemEditor} />
);
