import React from 'react';
import PropTypes from 'prop-types';

import { stringifyData } from '@samnbuk/react_db_client.helpers.data-processing';

import './style.scss';

export const SelectionPreview = ({ headings, currentSelectionData, customParsers }) => {
  const cellData = currentSelectionData
    ? headings.map((heading) => {
        const cleanedValue = stringifyData(
          currentSelectionData[heading.uid],
          heading,
          customParsers
        );
        return [heading.uid, heading.label, cleanedValue];
      })
    : [];
  return (
    <div className="flexHoriz">
      <h3>Selection Preview</h3>
      <ul className="selectionPreview_listWrap flexGrow">
        {cellData.map(([uid, label, value]) => {
          return (
            <li className="selectionPreview_listItem" key={uid}>
              <label>{label}: </label>
              {value}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

SelectionPreview.propTypes = {
  currentSelectionData: PropTypes.shape({
    uid: PropTypes.string,
    label: PropTypes.string,
  }).isRequired,
  headings: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  customParsers: PropTypes.objectOf(PropTypes.func),
};

SelectionPreview.defaultProps = {
  customParsers: {},
};
