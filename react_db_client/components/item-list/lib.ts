import { Uid } from '@react_db_client/constants.client-types';

export enum EViewTypes {
  DEFAULT = 'grid',
  LIST = 'list',
  GRID = 'grid',
}

export enum EItemTypes {
  LINK = 'link',
  IMAGE = 'image',
  BUTTON = 'button',
  COMPONENT = 'component',
}

export interface IItemCommon {
  uid: Uid;
  label: string;
  name?: string;
  hideOverlay?: boolean;
}

export interface IItemLink extends IItemCommon {
  hideOverlay?: boolean;
  type: EItemTypes.LINK;
}

export interface IItemImage extends IItemCommon {
  type: EItemTypes.IMAGE;
  src: string;
}


export interface IItemButton extends IItemCommon {
  type: EItemTypes.BUTTON;
  onClick?: (id: Uid) => void;
}

export interface IItemCustomComponent extends IItemCommon {
  type: EItemTypes.COMPONENT;
  component: React.ReactNode;
}

export interface IItemUnknown extends IItemCommon {
  type: "UNKNOWN";
}

export type TItem =
  | IItemLink
  | IItemImage
  | IItemButton
  | IItemCustomComponent
  | IItemUnknown;

export interface IOverlayButton {}
