export interface foo {

}

export enum EComparisons {
  EQUALS = '=',
  IS = '=',
  IS_EXACTLY = '=',
  CONTAINS = 'contains',
  REGEX = 'regex',
  EMPTY = 'empty',
  GREATER_THAN = '>',
  LESS_THAN = '<',
  AFTER = 'after',
  BEFORE = 'before',
  NOW = 'now',
  INVALID = 'invalid',
}

export enum EOperator {
  EQUALS = '=',
  CONTAINS = 'contains',
  REGEX = 'regex',
  EMPTY = 'empty',
  GREATER_THAN = '>',
  LESS_THAN = '<',
  INVALID = 'invalid',
}

export interface IComparison {
  uid: string;
  label: string;
  operator: EOperator;
}

export const comparisonMetaData: Record<EComparisons, IComparison> = {
  [EComparisons.EQUALS]: {
    uid: EComparisons.EQUALS,
    label: '=',
    operator: EOperator.EQUALS,
  },
  [EComparisons.IS]: {
    uid: EComparisons.IS,
    label: 'is',
    operator: EOperator.EQUALS,
  },
  [EComparisons.IS_EXACTLY]: {
    uid: EComparisons.IS_EXACTLY,
    label: 'is',
    operator: EOperator.EQUALS,
  },
  [EComparisons.CONTAINS]: {
    uid: EComparisons.CONTAINS,
    label: 'contains',
    operator: EOperator.CONTAINS,
  },
  [EComparisons.REGEX]: {
    uid: EComparisons.REGEX,
    label: 'contains',
    operator: EOperator.REGEX,
  },
  [EComparisons.EMPTY]: {
    uid: EComparisons.EMPTY,
    label: 'empty',
    operator: EOperator.EMPTY,
  },
  [EComparisons.GREATER_THAN]: {
    uid: EComparisons.GREATER_THAN,
    label: 'Greater than',
    operator: EOperator.GREATER_THAN,
  },
  [EComparisons.LESS_THAN]: {
    uid: EComparisons.LESS_THAN,
    label: 'Less than',
    operator: EOperator.LESS_THAN,
  },
  [EComparisons.AFTER]: {
    uid: EComparisons.AFTER,
    label: 'after',
    operator: EOperator.GREATER_THAN,
  },
  [EComparisons.BEFORE]: {
    uid: EComparisons.BEFORE,
    label: 'before',
    operator: EOperator.LESS_THAN,
  },
  [EComparisons.NOW]: {
    uid: EComparisons.NOW,
    label: 'now',
    operator: EOperator.EQUALS,
  },
  [EComparisons.INVALID]: {
    uid: EComparisons.INVALID,
    label: 'INVALID',
    operator: EOperator.INVALID,
  },
};

export const stringComparisons = {
  equals: '=',
  contains: 'contains',
  regex: 'regex',
  empty: 'empty',
} as const;

export const numberComparisons = {
  greaterThan: '>',
  lesserThan: '<',
} as const;

export const dateComparisons = {
  after: 'after',
  before: 'before',
} as const;

export const generalComparisons = {
  equals: '=',
};

export const comparisons = {
  ...generalComparisons,
  ...stringComparisons,
  ...numberComparisons,
  ...dateComparisons,
} as const;

// export type EComparisons = typeof comparisons[keyof typeof comparisons];
