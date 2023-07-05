import PropTypes from 'prop-types';

export const headingDataShape = {
  uid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  action: PropTypes.func,
  to: PropTypes.string,
};
/** Table Data Prop Type Shape
 * ... plus map against headings
 */
export const tableDataShape = {
  uid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string,
  // ... plus map against headings
};
