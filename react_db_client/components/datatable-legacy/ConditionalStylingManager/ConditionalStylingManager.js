/** A react hook to process rowData and conditional styling into row styles
 *
 */

// import { useState, useEffect, useMemo } from 'react';

import { evaluate } from 'mathjs';
import { replaceColumnIdsInExpression } from '../DataManager/processTableData';

const evaluateCondition = (styleRule, rowData, styleOverride) => {
  if (!styleRule) return {};
  const patternReplaced = replaceColumnIdsInExpression(styleRule, rowData);
  const result = patternReplaced ? evaluate(patternReplaced) : '';

  return result ? styleOverride : {};
};

const evaluateErrorCondition = (error, errorStyleOverride) => {
  if (!error) return {};
  return errorStyleOverride[error.type];
};

const useConditionalStylingManager = ({
  styleRule,
  data,
  styleOverride,
  baseStyle,
  rowErrors,
  errorStyleOverride,
}) => {
  const rowStyles = data.map((rowData, i) => ({
    ...baseStyle,
    ...evaluateCondition(styleRule, rowData, styleOverride),
    ...evaluateErrorCondition(rowErrors[i], errorStyleOverride),
  }));

  return {
    rowStyles,
  };
};
export default useConditionalStylingManager;
