import React from 'react';
import PropTypes from 'prop-types';
import { stringifyData } from '@react_db_client/helpers.data-processing';
import { Uid } from '@react_db_client/constants.client-types';

import { StyledListItemBtnStyle, StyledListItemCell } from './styles';
import { IHeading, IItem } from './lib';

export interface IListItemProps<ItemType extends IItem> {
  data: ItemType;
  handleSelect: (uid: Uid, data: ItemType) => void;
  headings: IHeading[];
  columnWidths: number[];
  customParsers: { [k: string]: (valIn: any) => any };
  isSelected?: boolean;
}

export const ListItem = <ItemType extends IItem>({
  data,
  handleSelect,
  headings,
  columnWidths,
  customParsers,
  isSelected,
}: IListItemProps<ItemType>) => {
  return (
    <StyledListItemBtnStyle
      key={data.uid}
      type="button"
      onClick={() => handleSelect(data.uid, data)}
      role="listitem"
      className="styledList_itemBtn"
      selected={isSelected}
    >
      {headings.map((heading, i) => (
        <StyledListItemCell
          key={heading.uid}
          style={{
            width: columnWidths[i],
          }}
        >
          {stringifyData(data[heading.uid], heading, customParsers)}
        </StyledListItemCell>
      ))}
    </StyledListItemBtnStyle>
  );
};

ListItem.propTypes = {
  data: PropTypes.shape({
    uid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  headings: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    })
  ).isRequired,
  handleSelect: PropTypes.func.isRequired,
  customParsers: PropTypes.objectOf(PropTypes.func).isRequired,
  columnWidths: PropTypes.arrayOf(PropTypes.number).isRequired,
  isSelected: PropTypes.bool.isRequired,
};
