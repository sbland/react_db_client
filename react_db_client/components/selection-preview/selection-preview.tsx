import React from 'react';
import PropTypes from 'prop-types';

import { stringifyData } from '@react_db_client/helpers.data-processing';
import { Uid } from '@react_db_client/constants.client-types';
import {
  SelectionPreviewLabelStyle,
  SelectionPreviewList,
  SelectionPreviewListItem,
} from './styles';

export interface IHeading {
  uid: Uid;
  label: string;
}

export type CustomParser = (value: any) => any;

export interface ISelectionPreviewProps {
  headings: IHeading[];
  currentSelectionData: { [id: string]: any };
  customParsers?: { [key: string]: CustomParser };
}

export const SelectionPreview = ({
  headings,
  currentSelectionData,
  customParsers,
}: ISelectionPreviewProps) => {
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
      <SelectionPreviewList>
        {cellData.map(([uid, label, value]) => {
          return (
            <SelectionPreviewListItem key={uid}>
              <SelectionPreviewLabelStyle>{label}: </SelectionPreviewLabelStyle>
              {value}
            </SelectionPreviewListItem>
          );
        })}
      </SelectionPreviewList>
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