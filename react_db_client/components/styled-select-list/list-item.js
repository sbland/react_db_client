import React from 'react'
import PropTypes from 'prop-types'
import { stringifyData } from '@samnbuk/react_db_client.helpers.data-processing';

import styles from './StyledSelectList.module.scss'

export const ListItem = ({
  data,
  handleSelect,
  headings,
  columnWidths,
  customParsers,
  isSelected,
  classes,
}) => {
  return (
    <button
      key={data.uid}
      className={`${styles.styledList_itemBtn} ${classes.styledList_itemBtn} ${isSelected ? classes.styledListItem_item_selected : ''}`}
      type='button'
      onClick={() => handleSelect(data.uid, data)}
      role='listitem'
    >
      {headings.map((heading, i) => (
        <div
          key={heading.uid}
          style={{
            width: columnWidths[i]
          }}
          className={`${styles.styledList_itemCell} ${
            isSelected ? 'selected' : ''
          }`}
        >
          {stringifyData(data[heading.uid], heading, customParsers)}
        </div>
      ))}
    </button>
  )
}

ListItem.propTypes = {
  data: PropTypes.shape({
    uid: PropTypes.string.isRequired
  }).isRequired,
  headings: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired
    })
  ).isRequired,
  handleSelect: PropTypes.func.isRequired,
  customParsers: PropTypes.objectOf(PropTypes.func).isRequired,
  columnWidths: PropTypes.arrayOf(PropTypes.number).isRequired,
  isSelected: PropTypes.bool.isRequired,
  classes: PropTypes.objectOf(PropTypes.string),
};

ListItem.defaultProps = {
    classes: styles,
}

