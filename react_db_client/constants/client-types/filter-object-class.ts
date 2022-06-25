/* eslint-disable max-classes-per-file */
import { FilterType, filterTypes } from './filter-types';
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
      return '';
  }
};

export interface IFilterObjectClassConstructorArgs {
  uid?: string;
  field?: string | null;
  label?: string | null;
  value?: null | string | number | boolean;
  operator?: EComparisons | null;
  type?: FilterType | string;
  filterOptionId?: string | null;
  isCustomType?: boolean;
}

export class FilterObjectClass {
  uid: string;
  field: string | null;
  value: string | number | boolean | null;
  label: string | null;
  operator: EComparisons;
  type: FilterType | string;
  filterOptionId: string | null;
  constructor({
    uid = `filter_${Date.now()}`,
    field = null,
    label = null,
    value = null,
    operator = null,
    type = filterTypes.text,
    filterOptionId = null,
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
    this.field = field;
    this.value = value != null && value !== undefined ? value : getDefaultValue(type);
    this.label = label || field;
    this.operator = operator || getDefaultComparison(type);
    this.type = type;
    this.filterOptionId = filterOptionId || field;
    Object.freeze(this);
  }
}

export class FilterObjectSimpleClass extends FilterObjectClass {
  constructor(field, value, uid = null) {
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
