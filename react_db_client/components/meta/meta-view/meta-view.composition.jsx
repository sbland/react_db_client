import React, { useState } from 'react';
import { MetaView } from './meta-view';
import { defaultProps } from './demo-data';
import { defaultComponentMap } from './default-component-map';

// TODO: Update old components to use uid instead of fieldName
// TODO: Update old components to use updateFormData instead of handleEditFormChange

const ViewModeToggleWrap = ({ children }) => {
  const childrenArray = Array.isArray(children) ? children : [children];
  const [state, setState] = useState(false);
  const childrenWithProps = React.Children.map(childrenArray, (child, i) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        viewMode: state ? 'edit' : 'view',
      });
    }
    return child;
  });

  return (
    <div>
      <button
        type="button"
        className={state ? 'button-two' : 'button-one'}
        onClick={() => setState((prev) => !prev)}
      >
        Edit mode
      </button>
      {childrenWithProps}
    </div>
  );
};

export const BasicMetaView = () => <MetaView {...defaultProps} />;
export const MetaViewDefaultComponents = () => (
  <ViewModeToggleWrap>
    <MetaView {...{ ...defaultProps, componentMap: defaultComponentMap({}) }} />
  </ViewModeToggleWrap>
);
