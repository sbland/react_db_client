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

export type EComparisons = typeof comparisons[keyof typeof comparisons];
