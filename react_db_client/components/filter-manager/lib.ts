import {
  EComparisons,
  EFilterType,
  FilterObjectClass,
  Uid,
} from '@react_db_client/constants.client-types';
import { FilterOption } from '@react_db_client/constants.client-types';

export interface ILabeled {
  uid: string;
  label: string;
}

export type TFieldId = Uid;
// export interface IFieldCommon {
//   uid: TFieldId;
//   label: string;
//   field?: string;
//   noFilter?: boolean;
//   validComparisons?: EComparisons[];
//   options?: ILabeled[];
//   multiple?: boolean;
// }
// export interface IField extends IFieldCommon {
//   type: EFilterType;
//   validComparisons?: EComparisons[];
//   isCustomFieldType?: false;
//   filters?: { [k: string]: IField };
// }

// export interface ICustomField extends IFieldCommon {
//   validComparisons: EComparisons[];
//   type: string;
//   isCustomFieldType: true;
// }

export type TFilterFunc<VType = unknown> = (v: VType) => boolean;

export type FilterId = string | number;

export interface IFilterComponentProps<VType = any, IsCustomType extends true | false = false> {
  key: string;
  filter: FilterObjectClass<VType, IsCustomType>;
  updateFilter: (newFilterData: FilterObjectClass) => void;
  fieldData: FilterOption<VType, IsCustomType>;
}

export interface IGetFilterComponentsProps {
  filterData: FilterObjectClass[];
  updateFilter: (filterId: FilterId, newFilterData: FilterObjectClass<any, boolean>) => void;
  fieldsData: { [key: string]: FilterOption<any, boolean> };
  customFiltersComponents: {
    [key: string]: React.FC<IFilterComponentProps<any, true>>;
  };
}

export interface IGetFilterComponentProps<VType = any, IsCustomType extends true | false = false> {
  filter: FilterObjectClass<VType, IsCustomType>;
  updateFilter: (newFilterData: FilterObjectClass<any, boolean>) => void;
  fieldData: FilterOption<VType, IsCustomType>;
  customFiltersComponents: { [key: string]: React.FC<IFilterComponentProps<any, true>> };
}

// export interface INestedFilterOption {
//   uid: Uid;
//   label: string;
//   type: EFilterType.embedded;
//   filters: { [k: string]: FilterOption<any, boolean> };
// }
