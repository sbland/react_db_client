import { EComparisons, FilterObjectClass } from '@react_db_client/constants.client-types';

export interface ILabeled {
  uid: string;
  label: string;
}
export interface IField {
  uid: string;
  label: string;
  type: string;
  noFilter?: boolean;
  validComparisons?: EComparisons[];
  options?: ILabeled[];
  multiple?: boolean;
}

export type FilterId = number;

export interface IFilterComponentProps {
  filter: FilterObjectClass;
  updateFilter: (newFilter: FilterObjectClass) => void;
  fieldData: IField;
}
