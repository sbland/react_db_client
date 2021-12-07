import React from 'react';
import PropTypes from 'prop-types';

// import { Link } from 'react-router-dom';

// TODO: remove legacy name field

// const LinkItem = ({ label, uid, linkPre }) => (
//   //   <Link to={`${linkPre}/${uid}`} className="maximize">
//   <button type="button" className="button-one" onClick={() => {}}>
//     <div>
//       <strong>{label}</strong>
//     </div>
//   </button>
//   //   </Link>
// );

// LinkItem.propTypes = {
//   label: PropTypes.string.isRequired,
//   uid: PropTypes.string.isRequired,
//   linkPre: PropTypes.string.isRequired,
// };

export const Item = ({
  onClick,
  data: {
    type,
    uid,
    label,
    name, // legacy
    component,
    src,
  },
}) => (
  <div className="itemList_item">
    {!type && <div>{label || name}</div>}
    {/* {type === 'link' && <LinkItem label={label || name} uid={uid} linkPre={linkPre} />} */}
    {type === 'button' && (
      <button
        type="button"
        className="button-reset maximize itemList_itemBtn"
        onClick={() => onClick(uid)}
      >
        <strong>{label || name}</strong>
      </button>
    )}
    {type === 'image' && (
      // NOTE: We set width and height to 0 so that it fill smin width and height of item list item wrap
      <img src={src} width="0" height="0" className="itemlist_item-image" alt={label} />
    )}
    {type === 'component' && component}
  </div>
);

Item.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string,
    name: PropTypes.string,
    uid: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['component', 'button', 'image']),
    component: PropTypes.node,
    src: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
};

Item.defaultProps = {
  onClick: (uid) => {},
};
