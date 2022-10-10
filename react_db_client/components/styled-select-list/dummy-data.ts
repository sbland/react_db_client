import PropTypes from 'prop-types';

export const listInputShape = {
  uid: PropTypes.string.isRequired,
};

export const demoHeadingsData = [
  {
    uid: 'uid',
    type: 'text',
    label: 'UID',
  },
  {
    uid: 'type',
    type: 'text',
    label: 'Type',
  },
  {
    uid: 'name',
    type: 'text',
    label: 'Name',
    columnWidth: 20,
  },
];

export const demoListInputData = [
  {
    uid: 'filterA',
    label: 'filter A',
    type: 'text',
  },
  {
    uid: 'filterB',
    label: 'filter B',
    type: 'text',
  },
];

export const demoListInputDataLong = [...Array(100).keys()].map((v, i) => ({
  uid: `filter-${i}`,
  label: `filter ${i}`,
  type: 'text',
}));
