// import React from 'react';
// import PropTypes from 'prop-types';

// export const SelectedItemsList = ({ currentSelectionLabels = [] }) => {
//   const mappedItems = currentSelectionLabels
//     ? currentSelectionLabels.map((item, i) => (
//         <button
//           type="button"
//           key={item}
//           className="button-one searchSelectedItem"
//           onClick={() => handleListItemSelect(currentSelectionUid[i])}
//         >
//           {item}
//         </button>
//       ))
//     : '';
//   return <div className="selectedItemsWrap">{mappedItems}</div>;
// };

// SelectedItemsList.propTypes = {
//     currentSelectionLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
// }