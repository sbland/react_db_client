import React from 'react';
import { EFilterType } from '@react_db_client/constants.client-types';
import { IFieldProps } from './IField';

export type TComponentMap = Record<EFilterType, () => React.FC<IFieldProps<unknown>>>;

export type TComponentMapCustom<K extends string | number | symbol> = Record<
  K,
  () => React.FC<IFieldProps<unknown>>
>;

export type TComponentMapFunc = <K extends never>() => TComponentMap | TComponentMapCustom<K>;
