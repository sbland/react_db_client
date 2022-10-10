import { Uid } from '@react_db_client/constants.client-types';

export interface IHeading {
  uid: string;
  label?: string;
  columnWidth?: number;
}

export interface IItem {
  uid: Uid;
  label: string;
}
