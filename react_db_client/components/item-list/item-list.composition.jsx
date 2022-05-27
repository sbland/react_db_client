import React from 'react';
import { CompositionWrapDefault } from '@react_db_client/helpers.composition-wraps';
import { ItemList } from './item-list';
import { demoData } from './demo-data';

const mockfn1 = () => alert('1');
const mockfn2 = () => alert('2');

const demoOverlayBtns = [
  { func: mockfn1, label: 'btn 01', icon: 'f1' },
  { func: mockfn2, label: 'btn 02', icon: 'f2' },
];

const defaultProps = {
  viewType: 'grid',
  items: demoData,
  overlayButtons: demoOverlayBtns,
  handleItemClick: (uid) => alert(`Clicked: ${uid}`),
};

export const BasicItemList = () => (
  <CompositionWrapDefault height="4rem" width="8rem">
    <ItemList {...defaultProps} />
  </CompositionWrapDefault>
);
