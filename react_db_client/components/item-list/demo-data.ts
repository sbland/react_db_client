import { Uid } from '@react_db_client/constants.client-types';
import { EItemTypes, TItem } from './lib';

export const demoData: TItem[] = [
  { label: 'A', uid: 'a', type: EItemTypes.BUTTON, onClick: (id: Uid) => {} },
  { label: 'B', uid: 'b', type: EItemTypes.BUTTON, onClick: (id: Uid) => {} },
  { label: 'C', uid: 'c', type: EItemTypes.BUTTON, onClick: (id: Uid) => {} },
];
