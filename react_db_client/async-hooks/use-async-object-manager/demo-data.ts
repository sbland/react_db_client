import { IDocument } from '@react_db_client/constants.client-types';

export interface IDemoDoc extends IDocument {
  goodbye?: string;
  injectedProp?: string;
}

export const demoLoadedData: IDemoDoc = {
  goodbye: 'newworld',
  uid: 'abc',
  label: 'Abc',
};

export const demoDbData = {
  demoCollection: { [demoLoadedData.uid]: demoLoadedData },
};
export const inputAdditionalData = { injectedProp: 'hello' };
