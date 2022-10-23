import React from 'react';
import PropTypes from 'prop-types';
import { EItemTypes, IItemButton, TItem } from './lib';
import { Uid } from '@react_db_client/constants.client-types';
import { ItemButtonStyle, ItemImageStyle, ItemStyle } from './styles';

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

export interface IItemProps {
  onClick: (id: Uid) => void;
  data: TItem;
}

export const Item = ({ onClick, data }: IItemProps) => (
  <ItemStyle>
    {(!data.type || data.type === 'UNKNOWN') && <div>{data.label || data.name}</div>}
    {/* {type === 'link' && <LinkItem label={label || name} uid={uid} linkPre={linkPre} />} */}
    {data.type === EItemTypes.BUTTON && (
      <ItemButtonStyle
        type="button"
        onClick={() =>
          data.onClick !== undefined
            ? data.onClick !== undefined && data.onClick(data.uid)
            : onClick(data.uid)
        }
      >
        <strong>{data.label || data.name}</strong>
      </ItemButtonStyle>
    )}
    {data.type === EItemTypes.IMAGE && (
      // NOTE: We set width and height to 0 so that it fill smin width and height of item list item wrap
      <ItemImageStyle src={data.src} width="0" height="0" alt={data.label} />
    )}
    {data.type === EItemTypes.COMPONENT && data.component}
  </ItemStyle>
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
