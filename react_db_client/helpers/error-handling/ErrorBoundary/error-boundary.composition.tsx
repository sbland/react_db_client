import React from 'react';
import ErrorBoundary from './ErrorBoundary';
// import { ErrorBoundary } from './ErrorBoundary';


const DemoComponent = ({ data }) => <div>{data.map((a) => a.label)}</div>;


export const BasicErrorBoundaryNoError = () => (
    <ErrorBoundary onError={() => { }}>
      <DemoComponent data={[{ label: 'hi' }]} />
    </ErrorBoundary>
  );


export const BasicErrorBoundaryError = () => (
    <ErrorBoundary onError={() => { }}>
      <DemoComponent data={null} />
    </ErrorBoundary>
  );
