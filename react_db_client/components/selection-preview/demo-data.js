import { filterTypes } from '@react_db_client/constants.client-types';

export const defaultProps = {
    headings: [
      {
        uid: 'uid',
        label: 'Uid',
        type: filterTypes.text,
      },
      {
        uid: 'label',
        label: 'Label',
        type: filterTypes.text,
      },
      {
        uid: 'other',
        label: 'Other',
        type: 'other',
      },
    ],
    currentSelectionData: {
      label: 'Foo',
      uid: 'foo',
      other: 'custom',
    },
    customParsers: {
      other: (value) => `{${value}}`,
    },
  };

