import { EOperator } from '@react_db_client/constants.client-types';

const stringContains = (val: string, searchTerm: string) => {
  return (val && val.search(new RegExp(searchTerm))) !== -1;
};

export const evaluateString = (value: any, operator: EOperator, target: string) => {
  if (operator === EOperator.EMPTY) {
    return value === '' || value === null || value === undefined;
  }
  if (typeof value === 'string') {
    switch (operator) {
      case EOperator.EQUALS:
        return value === target;
      case EOperator.CONTAINS:
        if (value == null || value === undefined || value === '') return false;
        return stringContains(value, target);
      case EOperator.REGEX:
        if (value == null || value === undefined || value === '') return false;
        return new RegExp(target, 'g').test(value);
      default:
        return false;
    }
  }
  return false;
};

export const evaluateNumber = (value: any, operator: EOperator, target: any) => {
  if (value == null || value === undefined || value === '') return false;
  if (target === null || target === undefined) return true;
  if (operator === null || operator === undefined) return true;
  if (typeof value === 'number') {
    // const operator = `${val} ${filter.operator} ${filterValue}`;
    switch (operator) {
      case EOperator.EQUALS:
        return value === target;
      case EOperator.GREATER_THAN:
        return value > target;
      case EOperator.LESS_THAN:
        return value < target;
      default:
        return false;
    }
    // return mathEvaluate(operator);
  }
  return false;
};

export const evaluateBool = (value: any, operator: EOperator, target: any) => {
  if (target === null || target === undefined) return true;
  if (operator === null || operator === undefined) return true;
  // NOTE: we match false target to any none value
  switch (operator) {
    case EOperator.EQUALS:
      return (!value && !target) || value === target;
    default:
      return false;
  }
};
