import React from 'react';
import { MetaView } from './meta-view';
import { defaultProps } from './demo-data';
import { defaultComponentMap } from '@samnbuk/react_db_client.components.form.form';

// TODO: Update old components to use uid instead of fieldName
// TODO: Update old components to use updateFormData instead of handleEditFormChange

export const BasicMetaView = () => <MetaView {...defaultProps} />;
export const MetaViewForm = () => (
  <MetaView {...{ ...defaultProps, componentMap: defaultComponentMap({}) }} />
);
