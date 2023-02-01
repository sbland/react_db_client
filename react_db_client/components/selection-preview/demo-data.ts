import { EFilterType } from '@react_db_client/constants.client-types';

export const defaultProps = {
  headings: [
    {
      uid: 'uid',
      label: 'Uid',
      type: EFilterType.text,
    },
    {
      uid: 'label',
      label: 'Label',
      type: EFilterType.text,
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
