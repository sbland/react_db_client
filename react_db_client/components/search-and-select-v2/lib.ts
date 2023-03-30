import {
  EFilterType,
  FilterObjectClass,
  IDocument,
  Uid,
} from '@react_db_client/constants.client-types';

import { IHeading as StyledListHeadings } from '@react_db_client/components.styled-select-list';

export interface IHeading extends StyledListHeadings {
  uid: Uid;
  type: EFilterType | string;
}

export type CustomParser = (value: any) => any;

export type TSearchAndSelectSearchFunction<ResultType extends IDocument> = (
  filters?: FilterObjectClass[],
  sortBy?: string,
  searchValue?: string,
  reverseSort?: boolean
) => Promise<ResultType[]>;
