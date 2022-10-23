import { EFilterType, Uid } from '@react_db_client/constants.client-types';

export interface IHeading {
  uid: string;
  label?: string;
  columnWidth?: number;
  type: EFilterType | string;
}

export interface IItem {
  uid: Uid;
  label: string;
}
