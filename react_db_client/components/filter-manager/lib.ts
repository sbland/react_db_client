import { EComparisons } from '@react_db_client/constants.client-types';

export interface IField {
  uid: string;
  label: string;
  type: string;
  noFilter: boolean;
  validComparisons?: EComparisons[];
}

export type FilterId = string | number;
