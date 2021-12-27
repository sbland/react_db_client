/*
Helper Component that acts as a switch between view types

1. Get Datatype
2. Get template for datatype from Redux Platform Data
3. Process template into DOM and fill in values


Also passes the view mode to the  fieldvalue components
*/

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import SidebarWrap, { SidebarWrapSide, SidebarWrapMain } from './sections';
import { mapSections } from './map-sections';
import { mapFields } from './map-fields';
import './style.scss';

export const MetaView = ({
  // React
  viewMode,
  pageData,
  datatypeData,
  templateData,
  fieldsData,
  hideMissing,
  updateFormData,
  componentMap,
}) => {
  const { sidebar, main } = templateData;

  /* Map field and map sections map the object fields to react components
   *
   */
  const mapFieldsFn = mapFields(
    componentMap,
    hideMissing,
    pageData,
    fieldsData,
    viewMode,
    datatypeData,
    updateFormData
  );
  const mapSectionsFn = mapSections(mapFieldsFn, hideMissing);

  const sidebarMapped = sidebar ? mapSectionsFn(sidebar) : 'Missing Sidebar';
  const mainMapped = main ? mapSectionsFn(main) : 'Missing Main';

  if (datatypeData && datatypeData.showSidebar) {
    return (
      <SidebarWrap>
        <SidebarWrapSide>{sidebarMapped}</SidebarWrapSide>
        <SidebarWrapMain>{mainMapped}</SidebarWrapMain>
      </SidebarWrap>
    );
  }
  return <Fragment>{mainMapped}</Fragment>;
};

const sectionShape = {
  uid: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const fieldShape = {
  uid: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  ftype: PropTypes.string.isRequired,
  showHeading: PropTypes.bool,
  readOnly: PropTypes.bool,
  args: PropTypes.objectOf(PropTypes.any),
}

MetaView.propTypes = {
  viewMode: PropTypes.string.isRequired,
  pageData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
  datatypeData: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  templateData: PropTypes.shape({
    sidebar: PropTypes.objectOf(PropTypes.shape(sectionShape)),
    main: PropTypes.objectOf(PropTypes.shape(sectionShape)),
  }).isRequired,
  fieldsData: PropTypes.objectOf(PropTypes.shape(fieldShape)).isRequired,
  hideMissing: PropTypes.bool,
  componentMap: PropTypes.objectOf(PropTypes.elementType).isRequired,
};

MetaView.defaultProps = {
  hideMissing: false,
};
