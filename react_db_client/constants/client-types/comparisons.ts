

export enum StringComparisons {
  equals= '=',
  contains= 'contains',
  regex= 'regex',
  empty= 'empty',
};

export enum NumberComparisons {
  greaterThan= '>',
  lesserThan= '<',
};

export enum DateComparisons {
  after= 'after',
  before= 'before',
};


export const Comparisons = {
  equals: '=',
  ...StringComparisons,
  ...NumberComparisons,
  ...DateComparisons,
}
export type Comparisons = typeof Comparisons;


export const stringComparisons = {
  equals: '=',
  contains: 'contains',
  regex: 'regex',
  empty: 'empty',
};

export const numberComparisons = {
  greaterThan: '>',
  lesserThan: '<',
};

export const dateComparisons = {
  after: 'after',
  before: 'before',
};

export const comparisons = {
  equals: '=',
  ...stringComparisons,
  ...numberComparisons,
  ...dateComparisons,
};

