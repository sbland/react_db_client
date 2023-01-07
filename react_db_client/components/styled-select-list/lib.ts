import { EFilterType, Uid } from '@react_db_client/constants.client-types';

export interface IHeading {
  uid: Uid;
  label: string | React.ReactNode;
  columnWidth?: number;
  type: EFilterType | string;
}

export interface IItem {
  uid: Uid;
  label: string;
}
