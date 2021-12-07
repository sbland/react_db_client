import React from 'react';
import PropTypes from 'prop-types';

import { OverlayButtons } from './overlay-buttons';
import { Item } from './item';
import './style.scss';

/**
 *
 *
 * @param {*} {
 *   viewType, - sets the style
 *   items, - list of item objects
 *   linkPre, - start of link
 *   overlayButtons, - list of overlay btn details
 * }
 */
export const ItemList = ({ viewType, items, overlayButtons, selectedId, handleItemClick }) => (
  <div className={`itemList_wrap ${viewType}`}>
    <ul className="itemList">
      {items.map((item) => (
        <li
          className={`itemList_itemWrap ${item.uid === selectedId ? 'selected' : ''}`}
          key={item.uid || JSON.stringify(item)}
        >
          {overlayButtons && !item.hideOverlay && (
            <OverlayButtons uid={item.uid} overlayButtons={overlayButtons} />
          )}
          <Item data={item} onClick={(uid) => handleItemClick(uid)} />
        </li>
      ))}
    </ul>
  </div>
);

ItemList.propTypes = {
  viewType: PropTypes.oneOf(['grid', 'list']).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        label: PropTypes.string,
        name: PropTypes.string,
        uid: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['link', 'component', 'button', 'image']),
        onClick: PropTypes.func,
        component: PropTypes.node,
      }),
      PropTypes.node,
    ])
  ).isRequired,
  overlayButtons: PropTypes.arrayOf(
    PropTypes.shape({
      func: PropTypes.func.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  selectedId: PropTypes.string,
  handleItemClick: PropTypes.func,
};

ItemList.defaultProps = {
  overlayButtons: null,
  selectedId: null,
  handleItemClick: (uid) => {},
};
