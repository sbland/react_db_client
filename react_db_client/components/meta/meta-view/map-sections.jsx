import React from 'react';
import { SidebarWrapSideSection } from './sections';

export const mapSections = (mapFieldsFn, hideMissing) => (data) =>
  Object.keys(data).map((key) => {
    const section = data[key];
    const { label, fields, position, showTitle } = section;
    const fieldsMapped = mapFieldsFn(fields);
    if (hideMissing && fieldsMapped.length === 0) return <Fragment />;
    return (
      <SidebarWrapSideSection title={label} key={key} position={position} showTitle={showTitle}>
        {fieldsMapped}
      </SidebarWrapSideSection>
    );
  });
