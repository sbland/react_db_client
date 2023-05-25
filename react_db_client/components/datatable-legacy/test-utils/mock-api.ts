import { Uid } from '@react_db_client/constants.client-types';

export const saveData: (
  data,
  action: string,
  newData?,
  rowId?: Uid,
  colIds?: Uid[]
) => void = (data) => {
  console.info(data);
  return;
};
