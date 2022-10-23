import React, { useState } from 'react';

const setDim = (diff) => (prev) => {
  if (prev === 'auto') return `${1}rem`;
  const prevDim = parseInt(prev.replace('rem', '')) + diff;
  return `${prevDim}rem`;
};

export interface ICompositionWrapDefaultProps {
  children: React.ReactElement<any> | React.ReactElement<any>[];
  width?: number | string;
  height?: number | string;
  horizontal?: boolean;
}

export function CompositionWrapDefault({
  children,
  width = undefined,
  height = undefined,
  horizontal = false,
}: ICompositionWrapDefaultProps) {
  const [heightActive, setHeightActive] = useState(height == null ? 'auto' : height);
  const [widthActive, setWidthActive] = useState(width == null ? 'auto' : width);
  const [allowOverflow, setAllowOverflow] = useState(false);
  const [padding, setPadding] = useState(0);

  const styleOuter = {
    outline: '1px solid red',
    margin: 0,
    padding: '1rem',
    height: heightActive,
    width: widthActive,
    overflow: allowOverflow ? 'visible' : 'hidden',
  };
  const styleInner: React.CSSProperties = {
    outline: '1px solid green',
    margin: 0,
    padding,
    width: '100%',
    height: '100%',
    overflow: allowOverflow ? 'visible' : 'hidden',
    display: horizontal ? 'flex' : 'block',
    position: 'relative',
    boxSizing: 'border-box',
  };

  const btnStyle = (isOn) => ({
    background: isOn ? 'green' : 'red',
  });

  return (
    <div>
      <button onClick={() => setHeightActive(setDim(5))}>+5 Height</button>
      <button onClick={() => setWidthActive(setDim(5))}>+5 Width</button>
      <button onClick={() => setHeightActive(setDim(-5))}>-5 Height</button>
      <button onClick={() => setWidthActive(setDim(-5))}>-5 Width</button>
      <button style={btnStyle(allowOverflow)} onClick={() => setAllowOverflow((prev) => !prev)}>
        Overflow
      </button>
      <button style={btnStyle(padding)} onClick={() => setPadding((prev) => (prev ? 0 : 10))}>
        Padding
      </button>

      <div style={styleOuter}>
        <div style={styleInner}>{children}</div>
      </div>
    </div>
  );
}

export const WrapFieldComponent: React.FC = ({ children }) => {
  const childrenArray = Array.isArray(children) ? children : [children];
  const [state, setState] = useState(childrenArray.map((child) => child.props.value));
  const childrenWithProps = React.Children.map(childrenArray, (child, i) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        uid: `uid_${i}`,
        value: state[i],
        updateFormData: (k, v) =>
          setState((prev) => {
            const a = [...prev];
            a[i] = v;
            return a;
          }),
      });
    }
    return child;
  });

  return (
    <div>
      {childrenWithProps}
      <div className="">{state}</div>
    </div>
  );
};
