import React from 'react';
import PropTypes from 'prop-types';

import { FilterObjectClass, FilterOption } from '@react_db_client/constants.client-types';
import { TFilterFunc } from './lib';

export interface IAddFilterButtonProps {
  fieldsData: { [key: string]: FilterOption<any, boolean> };
  returnNewFilter: <Vtype, IsCustomType extends boolean>(
    newFilter: FilterObjectClass<Vtype, IsCustomType>
  ) => void;
  customFilters?: { [key: string]: TFilterFunc };
}

export const AddFilterButton: React.FC<IAddFilterButtonProps> = ({
  fieldsData,
  returnNewFilter,
  customFilters = {},
}) => {
  const handleNewFilter = () => {
    // Add a new filter and use the first field as initial field
    const initialFieldData = Object.values(fieldsData)[0];
    const { uid, field, type, label } = initialFieldData;
    const isCustomFieldType = Object.keys(customFilters).indexOf(type) >= 0;

    const newFilter = new FilterObjectClass({
      field: field || uid,
      type,
      label,
      filterOptionId: uid,
      isCustomType: isCustomFieldType,
    });
    returnNewFilter(newFilter);
  };

  return (
    <button type="button" className="button-two addFilterBtn" onClick={handleNewFilter}>
      Add Filter
    </button>
  );
};

AddFilterButton.propTypes = {
  returnNewFilter: PropTypes.func.isRequired,
  fieldsData: PropTypes.objectOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  customFilters: PropTypes.objectOf(PropTypes.func),
};

AddFilterButton.defaultProps = {
  customFilters: {},
};
