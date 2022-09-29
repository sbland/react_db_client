import React from 'react';

export type TPopupId = string | number;

export interface IPopupPanelContext {
  popupCount: number;
  registerPopup: (id: TPopupId) => void;
  deregisterPopup: (id: TPopupId) => void;
  baseZIndex: number;
  openPopup: (id: TPopupId) => void;
  closePopup: (id: TPopupId) => void;
  popupRegister: { [id: TPopupId]: boolean };
}

export interface IPopupProviderProps {
  initialState?: Partial<IPopupPanelContext>;
  children: React.ReactNode;
}

export const defaultState: IPopupPanelContext = {
  popupCount: 0,
  registerPopup: (id: TPopupId) => null,
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

  const registerPopup = (id: TPopupId) => {
    setPopupRegister((prev) => ({ ...prev, [id]: false }));
  };

  const deregisterPopup = (id: TPopupId) => {
    setPopupRegister((prev) => {
      const out = { ...prev };
      delete out[id];
      return out;
    });
  };

  const openPopup = (id: TPopupId) => {
    popupCount.current += 1;
    if (popupRegister[id] !== undefined) setPopupRegister((prev) => ({ ...prev, [id]: true }));
  };

  const closePopup = (id: TPopupId) => {
    popupCount.current -= 1;
    if (popupRegister[id] !== undefined) setPopupRegister((prev) => ({ ...prev, [id]: false }));
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
