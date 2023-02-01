/* eslint-disable max-classes-per-file */
import { EFilterType, filterTypes } from './filter-types';
import {
  comparisons,
  EComparisons,
  generalComparisons,
  numberComparisons,
  stringComparisons,
} from './comparisons';
import { Uid } from './uid';
import { ILabelled } from './lib';

const getAvailableComparisons = (type: EFilterType) => {
  switch (type) {
    case EFilterType.bool:
      return Object.values(generalComparisons);
    case EFilterType.number:
      return Object.values(numberComparisons);
    case EFilterType.text:
    case EFilterType.textLong:
      return Object.values(stringComparisons);
    default:
      return Object.values(generalComparisons);
  }
};

const getDefaultComparison = (type: EFilterType) => {
  switch (type) {
    case EFilterType.bool:
      return Object.values(generalComparisons)[0];
    case EFilterType.number:
      return Object.values(numberComparisons)[0];
    case EFilterType.text:
    case EFilterType.textLong:
      return Object.values(stringComparisons)[0];
    default:
      return Object.values(generalComparisons)[0];
  }
};

const getDefaultValue = (type: EFilterType) => {
  switch (type) {
    case EFilterType.bool:
    case EFilterType.toggle:
      return false;
    case EFilterType.number:
      return 0;
    case EFilterType.text:
    default:
      return undefined;
  }
};

export type TFilterId = Uid;
export type TFilterOptId = Uid;

export interface IFilterOptionsArgs<
  VType,
  IsCustomType extends true | false = false
> {
  uid: TFilterOptId;
  field?: Uid;
  label: string;
  operators?: EComparisons[];
  options?: ILabelled[];
  multiple?: boolean;
  type: IsCustomType extends true ? string : EFilterType;
  isCustomType?: IsCustomType;
  value?: VType;
}

/**
 * Filter Options Objects describe a filter that can be applied.
 */
export class FilterOption<
  VType = any,
  IsCustomType extends true | false = boolean
> {
  uid: TFilterOptId;
  field: Uid;
  label: string;
  operators: EComparisons[];
  type: IsCustomType extends true ? string : EFilterType;
  isCustomType: IsCustomType;
  typeArgs: {
    options?: ILabelled[];
    multiple?: boolean;
  };

  constructor({
    uid = `filter_${Date.now()}`,
    field,
    label,
    operators,
    type,
    isCustomType,
    options,
    multiple,
  }: IFilterOptionsArgs<VType, IsCustomType>) {
    if (!(type in filterTypes) && !isCustomType)
      console.warn(
        `Invalid Filter (${uid}|${label}) Type ${type} must set isCustomType. Field: ${field}`
      );
    if (!field) throw Error('Must have field id');
    if (!label && !field) throw Error('Must have field or label');
    this.uid = uid;
    this.field = field || uid;
    this.label = (label || field) as string;
    this.operators = operators || getAvailableComparisons(type as EFilterType);
    this.type = type;
    this.isCustomType = isCustomType || (false as IsCustomType);
    this.typeArgs = {
      options,
      multiple,
    };
    Object.freeze(this);
  }
}

export interface IFilterObjectClassConstructorArgs<
  IsCustomType extends true | false = false
> {
  uid?: TFilterId;
  field?: Uid;
  label?: string;
  value?: null | string | number | boolean;
  operator?: EComparisons;
  type?: IsCustomType extends true ? string : EFilterType;
  filterOptionId?: Uid;
  isCustomType?: IsCustomType;
}

/**
 * A FilterObjectClass instance describes a filter that has been applied.
 */
export class FilterObjectClass<
  VType = any,
  IsCustomType extends true | false = boolean
> {
  isValidFilter?: boolean;
  uid: TFilterId;
  field: Uid;
  value: VType;
  label: string;
  operator: EComparisons;
  type: IsCustomType extends true ? string : EFilterType;
  filterOptionId?: Uid;
  isCustomType: IsCustomType;
  constructor({
    uid = `filter_${Date.now()}`,
    field = undefined, // This is the field passed to search function
    label = undefined,
    value = undefined,
    operator = undefined,
    type = EFilterType.text,
    filterOptionId = undefined, // this is the field we use to get field data
    isCustomType = false as IsCustomType,
  }: IFilterObjectClassConstructorArgs<IsCustomType> = {}) {
    /* validate input */
    if (!(type in filterTypes) && !isCustomType)
      console.warn(
        `Invalid Filter (${uid}|${label}) Type ${type} must set isCustomType. Field: ${field}`
      );
    if (!field && !uid) throw Error('Must have field or UID');
    // if (value == null) throw Error('Must have value');
    if (!label && !field) throw Error('Must have field or label');
    if (operator && Object.values(comparisons).indexOf(operator) === -1)
      throw Error(`Invalid operator ${operator}`);
    this.uid = uid;
    this.field = field || uid;
    this.value = (value != null && value !== undefined
      ? value
      : getDefaultValue(type as EFilterType)) as unknown as VType;
    this.label = (label || field) as string;
    this.operator = operator || getDefaultComparison(type as EFilterType);
    this.type = type;
    this.filterOptionId = filterOptionId || field;
    this.isCustomType =
      (isCustomType as IsCustomType) || (false as IsCustomType);
    this.isValidFilter = true;
    Object.freeze(this);
  }

  asString() {
    return [this.uid, this.label, this.value, this.operator].join('-');
  }
}

export class FilterObjectSimpleClass extends FilterObjectClass {
  constructor(field: string, value: any, uid: null | string = null) {
    if (!field) throw Error('Must have field');
    super({
      uid: uid || `filter_${Date.now()}`,
      field,
      value,
      operator: comparisons.equals,
      type: EFilterType.text,
    });
  }
}
