import React from 'react';
import { switchF } from '@samnbuk/react_db_client.helpers.func-tools';

import { SidebarSectionSubHeading } from './sections';

const defaultComponent = () => <div>PLACEHOLDER</div>;

export const mapFields =
  (componentMap, hideMissing, pageData, fieldsData, viewMode, datatypeData, updateFormData) =>
  (sectionFields) =>
    sectionFields
      .filter(
        (field) =>
          !hideMissing ||
          field in pageData ||
          (fieldsData[field] && fieldsData[field].args && fieldsData[field].args.alwaysShow) ||
          (fieldsData[field] &&
            fieldsData[field].args &&
            fieldsData[field].args.fieldName in pageData)
      )
      .map((field) => {
        // Check field has associated data
        if (!(field in fieldsData)) {
          return <p key={field}>Invalid Field: {field}</p>;
        }
        const { uid: datatypeUid } = datatypeData;

        const fieldData = fieldsData[field];
        const { ftype, label, showHeading, readOnly, args, _id: uid } = fieldData;

        const classNames = 'fieldValue';

        const FieldComponent = switchF(ftype, componentMap, defaultComponent);

        const value = pageData[uid];

        if (readOnly && viewMode === 'edit') {
          return (
            <div className={classNames} key={field}>
              <SidebarSectionSubHeading title={label} uid={uid} />
              <p>Read Only Field</p>
            </div>
          );
        }

        return (
          <div className={classNames} key={field}>
            {(showHeading || showHeading === undefined) && (
              <SidebarSectionSubHeading title={label} uid={uid} />
            )}
            {FieldComponent && (
              <FieldComponent
                datatypeMetaData={datatypeData}
                datatype={datatypeUid}
                pageData={pageData}
                viewMode={viewMode}
                value={value}
                updateFormData={updateFormData}
                uid={uid}
                type={ftype}
                {...args}
              />
            )}
            {!FieldComponent && (
              <div>
                Invalid Field type
                {ftype}
              </div>
            )}
          </div>
        );
      });

/*
// TODO: Implement cached fields system.
// TODO: We will need to set this up as an async hook

Everytime we request field data we will check a cache to see if it has already been loaded
If it hasn't we need to make a call to the server for those fields.
We could batch load these too.

*/
