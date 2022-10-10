/* eslint-disable max-classes-per-file */
import { EFilterType, filterTypes } from './filter-types';
import { comparisons, EComparisons } from './comparisons';

const getDefaultComparison = (fieldType) => {
  switch (fieldType) {
    case filterTypes.bool:
      return comparisons.equals as EComparisons;
    case filterTypes.text:
    case filterTypes.textLong:
      return comparisons.contains as EComparisons;
    default:
      return comparisons.equals as EComparisons;
  }
};

const getDefaultValue = (fieldType) => {
  switch (fieldType) {
    case filterTypes.bool:
    case filterTypes.toggle:
      return false;
    case filterTypes.number:
      return 0;
    case filterTypes.text:
    default:
      return undefined;
  }
};

export interface IFilterObjectClassConstructorArgs {
  uid?: string;
  field?: string;
  label?: string;
  value?: null | string | number | boolean;
  operator?: EComparisons;
  type?: EFilterType | string;
  filterOptionId?: string;
  isCustomType?: boolean;
}

export class FilterObjectClass<VType = any> {
  uid: string;
  field: string;
  value: VType;
  label: string;
  operator: EComparisons;
  type: EFilterType | string;
  filterOptionId?: string;
  constructor({
    uid = `filter_${Date.now()}`,
    field = undefined,
    label = undefined,
    value = undefined,
    operator = undefined,
    type = filterTypes.text,
    filterOptionId = undefined,
    isCustomType = false,
  }: IFilterObjectClassConstructorArgs = {}) {
    /* validate input */
    if (!(type in filterTypes) && !isCustomType)
      console.warn(`Invalid Filter Type ${type} must set isCustomType`);
    if (!field && !uid) throw Error('Must have field or UID');
    // if (value == null) throw Error('Must have value');
    if (!label && !field) throw Error('Must have field or label');
    if (operator && Object.values(comparisons).indexOf(operator) === -1)
      throw Error(`Invalid operator ${operator}`);
    this.uid = uid;
    this.field = field || uid;
    this.value = (value != null && value !== undefined
      ? value
      : getDefaultValue(type)) as unknown as VType;
    this.label = (label || field) as string;
    this.operator = operator || getDefaultComparison(type);
    this.type = type;
    this.filterOptionId = filterOptionId || field;
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
      type: filterTypes.text,
    });
  }
}
