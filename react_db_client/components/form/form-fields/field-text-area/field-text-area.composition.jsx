import React, { useState } from 'react';
import { CompositionWrapDefault } from '@samnbuk/react_db_client.helpers.composition-wraps/dist';
import { FieldTextArea } from './field-text-area';
import { defaultVal } from './demo-data';

const updateFormData = () => {};

const defaultProps = {
  uid: 'uid',
  unit: 'unit',
  value: defaultVal,
  updateFormData,
};

const WrapFieldComponent = ({ children }) => {
  const [state, setState] = useState(children.map(() => undefined));
  const childrenWithProps = React.Children.map(children, (child, i) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        uid: i,
        value: state[i],
        updateFormData: (k, v) =>
          setState((prev) => {
            const a = [...prev];
            a[k] = v;
            return a;
          }),
      });
    }
    return child;
  });

  return <div>{childrenWithProps}</div>;
};

export const BasicFieldTextArea = () => (
  <CompositionWrapDefault height="4rem" width="16rem">
    <FieldTextArea {...defaultProps} required />
  </CompositionWrapDefault>
);

export const FieldTextAreaMultiple = () => (
  <CompositionWrapDefault height="4rem" width="16rem">
    <FieldTextArea {...defaultProps} required />
    <FieldTextArea {...defaultProps} required />
    <FieldTextArea {...defaultProps} required />
  </CompositionWrapDefault>
);

export const FieldTextAreaMultipleHoriz = () => {
  return (
    <CompositionWrapDefault height="4rem" width="16rem">
      <div style={{ display: 'flex' }}>
        <WrapFieldComponent>
          <FieldTextArea {...defaultProps} required />
          <FieldTextArea {...defaultProps} required />
          <FieldTextArea {...defaultProps} required />
        </WrapFieldComponent>
      </div>
    </CompositionWrapDefault>
  );
};
