import React from 'react';
import { getRoot } from '@react_db_client/helpers.get-root';

export type TPopupId = string | number;

export interface IPopupElementState {
  open?: boolean;
  root: HTMLElement;
  deleteRootOnUnmount?: boolean;
}
export interface IPopupPanelContext {
  popupCount: number;
  registerPopup: (
    id: TPopupId,
    root: string | HTMLElement | undefined,
    deleteRootOnUnmount?: boolean
  ) => void;
  deregisterPopup: (id: TPopupId) => void;
  baseZIndex: number;
  openPopup: (id: TPopupId) => void;
  closePopup: (id: TPopupId) => void;
  popupRegister: { [id: TPopupId]: IPopupElementState };
}

export interface IPopupProviderProps {
  initialState?: Partial<IPopupPanelContext>;
  children: React.ReactNode;
}

export const defaultState: IPopupPanelContext = {
  popupCount: 0,
  registerPopup: (
    id: TPopupId,
    root?: string | HTMLElement | undefined,
    deleteRootOnUnmount?: boolean
  ) => null,
  deregisterPopup: (id: TPopupId) => null,
  baseZIndex: 100,
  openPopup: (id: TPopupId) => {
    throw Error('openPopup is NOT DEFINED');
  },
  closePopup: (id: TPopupId) => {
    throw Error('closePopup is NOT DEFINED');
  },
  popupRegister: {},
};

export const PopupPanelContext = React.createContext(defaultState);

const EMPTY_OBJECT = {};

export const PopupProvider = ({ initialState = defaultState, children }: IPopupProviderProps) => {
  const popupCount = React.useRef(0);
  const [popupRegister, setPopupRegister] = React.useState(
    initialState.popupRegister || EMPTY_OBJECT
  );

  const registerPopup = (
    id: TPopupId,
    popupRoot: string | HTMLElement | undefined,
    deleteRootOnUnmount?: boolean
  ) => {
    const root = getRoot(popupRoot || id, id);
    setPopupRegister((prev) => ({ ...prev, [id]: { open: false, root, deleteRootOnUnmount } }));
  };

  const deregisterPopup = (id: TPopupId) => {
    setPopupRegister((prev) => {
      const registerCopy = { ...prev };
      const { deleteRootOnUnmount, root } = registerCopy[id] || {};
      if (deleteRootOnUnmount && root) {
        root.remove();
      }
      delete registerCopy[id];
      return registerCopy;
    });
  };

  const openPopup = (id: TPopupId) => {
    popupCount.current += 1;
    if (popupRegister[id] !== undefined)
      setPopupRegister((prev) => ({ ...prev, [id]: { ...prev[id], open: true } }));
  };

  const closePopup = (id: TPopupId) => {
    popupCount.current -= 1;
    if (popupRegister[id] !== undefined)
      setPopupRegister((prev) => ({ ...prev, [id]: { ...prev[id], open: false } }));
  };

  const mergedValue = {
    ...defaultState,
    ...initialState,
    popupCount: popupCount.current,
    openPopup,
    closePopup,
    registerPopup,
    deregisterPopup,
    popupRegister,
  };

  return <PopupPanelContext.Provider value={mergedValue}>{children}</PopupPanelContext.Provider>;
};
