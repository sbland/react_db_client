import React from 'react';
import { getRoot } from '@react_db_client/helpers.html-helpers';

export type TPopupId = string | number;

export interface IPopupElementState {
  open?: boolean;
  root: HTMLElement;
  deleteRootOnUnmount?: boolean;
  z: number;
  onCloseCallback: () => void;
}

export interface IRegisterPopupArgs {
  id: TPopupId;
  root: string | HTMLElement | undefined;
  deleteRootOnUnmount?: boolean;
  z?: number;
  onCloseCallback?: () => void;
}

export interface IPopupPanelContext {
  popupCount: number;
  registerPopup: (args: IRegisterPopupArgs) => void;
  deregisterPopup: (id: TPopupId) => void;
  baseZIndex: number;
  checkIsOpen: (id: TPopupId) => boolean;
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
  baseZIndex: 100,
  registerPopup: (args) => {
    throw Error('registerPopup is NOT DEFINED');
  },
  deregisterPopup: (id: TPopupId) => {
    throw Error('deregisterPopup is NOT DEFINED');
  },
  openPopup: (id: TPopupId) => {
    throw Error('openPopup is NOT DEFINED');
  },
  checkIsOpen: (id: TPopupId) => {
    throw Error('checkIsOpen is NOT DEFINED');
  },
  closePopup: (id: TPopupId) => {
    throw Error('closePopup is NOT DEFINED');
  },
  popupRegister: {},
};

export const PopupPanelContext = React.createContext(defaultState);

const EMPTY_OBJECT = {};

export const PopupProvider = ({
  initialState = defaultState,
  children,
}: IPopupProviderProps) => {
  const popupCount = React.useRef(0);
  const [popupRegister, setPopupRegister] = React.useState(
    initialState.popupRegister || EMPTY_OBJECT
  );

  const registerPopup = React.useCallback(
    ({
      id,
      root: popupRoot,
      deleteRootOnUnmount,
      z,
      onCloseCallback,
    }: IRegisterPopupArgs) => {
      const root = getRoot(popupRoot || String(id), String(id));
      setPopupRegister((prev) => ({
        ...prev,
        [id]: {
          open: false,
          root,
          deleteRootOnUnmount,
          z: z || popupCount?.current,
          onCloseCallback: onCloseCallback || (() => {}),
        },
      }));
    },
    []
  );

  const deregisterPopup = React.useCallback((id: TPopupId) => {
    setPopupRegister((prev) => {
      const registerCopy = { ...prev };
      const { deleteRootOnUnmount, root } = registerCopy[id] || {};
      if (deleteRootOnUnmount && root) {
        root.remove();
      }
      delete registerCopy[id];
      return registerCopy;
    });
  }, []);

  const openPopup = (id: TPopupId) => {
    popupCount.current += 1;
    if (popupRegister[id] !== undefined)
      setPopupRegister((prev) => ({
        ...prev,
        [id]: { ...prev[id], open: true },
      }));
    else {
      throw new Error(
        `Attempted to open popup that isn't registered! Id is ${id}`
      );
    }
  };

  const closePopup = (id: TPopupId) => {
    popupCount.current -= 1;
    if (popupRegister[id] !== undefined) {
      setPopupRegister((prev) => ({
        ...prev,
        [id]: { ...prev[id], open: false },
      }));
      popupRegister[id].onCloseCallback();
    }
  };

  const checkIsOpen = (id: TPopupId) => {
    return popupRegister[id]?.open || false;
  };

  const mergedValue: IPopupPanelContext = {
    ...defaultState,
    ...initialState,
    popupCount: popupCount.current,
    openPopup,
    closePopup,
    checkIsOpen,
    registerPopup,
    deregisterPopup,
    popupRegister,
  };

  return (
    <PopupPanelContext.Provider value={mergedValue}>
      {children}
    </PopupPanelContext.Provider>
  );
};
