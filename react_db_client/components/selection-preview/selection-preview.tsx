import React from 'react';
import PropTypes from 'prop-types';

import { stringifyData } from '@react_db_client/helpers.data-processing';
import { EFilterType, Uid } from '@react_db_client/constants.client-types';
import {
  SelectionPreviewLabelStyle,
  SelectionPreviewList,
  SelectionPreviewListItem,
} from './styles';

export interface IHeading {
  uid: Uid;
  label: string | React.ReactNode;
  type: EFilterType | string;
}

export type CustomParser = (value: any) => any;

export interface ISelectionPreviewProps {
  headings: IHeading[];
  currentSelectionData: { [id: string]: any };
  customParsers?: { [key: string]: CustomParser };
  listStyleOverride?: Partial<React.CSSProperties>;
}

export const SelectionPreview = ({
  headings,
  currentSelectionData,
  customParsers,
  listStyleOverride = {},
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
      <SelectionPreviewList style={{ ...listStyleOverride }}>
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
    uid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
  }).isRequired,
  headings: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  customParsers: PropTypes.objectOf(PropTypes.func),
};

SelectionPreview.defaultProps = {
  customParsers: {},
};
