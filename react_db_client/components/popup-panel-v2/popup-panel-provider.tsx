import React from 'react';
import { getRoot } from '@react_db_client/helpers.html-helpers';
import { Uid } from '@react_db_client/constants.client-types';

export type TPopupId = string | number;

export interface IPopupElementState {
  open?: boolean;
  root: HTMLElement;
  deleteRootOnUnmount?: boolean;
  z: number;
}

export interface IRegisterPopupArgs {
  id: TPopupId;
  root: string | HTMLElement | undefined;
  deleteRootOnUnmount?: boolean;
  z?: number;
}
export type PopupRegister = { [id: TPopupId]: IPopupElementState };

export interface IPopupProviderState {
  popupRegister: PopupRegister;
  popupCount: number;
  baseZIndex: number;
}

export interface IPopupPanelContext {
  dispatchPopupRegister: React.Dispatch<ActionArgs>;
  state: IPopupProviderState;

  openPopup: (id: Uid) => void;
  closePopup: (id: Uid) => void;
}

export interface IPopupProviderProps {
  initialState?: Partial<IPopupPanelContext>;
  children: React.ReactNode;
}

export const defaultState: IPopupPanelContext = {
  dispatchPopupRegister: () => {
    throw Error('dispatchPopupRegister is NOT DEFINED');
  },
  state: {
    popupRegister: {},
    popupCount: 0,
    baseZIndex: 100,
  },
  openPopup: () => {
    throw Error('openPopup is NOT DEFINED');
  },
  closePopup: () => {
    throw Error('closePopup is NOT DEFINED');
  },
};

export const PopupPanelContext = React.createContext(defaultState);

const EMPTY_OBJECT = {};

const getRegisteredPopupItem = ({id, root, deleteRootOnUnmount, z}: IRegisterPopupArgs) => {
  const rootSet = getRoot(root || String(id), String(id));
  return {
    root: rootSet,
    deleteRootOnUnmount,
    z: z || 0,
  };
}

const registerPopup = (
  { id, root, deleteRootOnUnmount, z }: IRegisterPopupArgs,
  popupState: IPopupProviderState
) => {
  const { popupRegister } = popupState;
  const newItem: IPopupElementState = getRegisteredPopupItem({id, root, deleteRootOnUnmount, z})
  const registerCopy = {
    ...popupRegister,
    [id]: {
      ...newItem,
      open: popupRegister[id]?.open || false, // Fix in case attempted to open before register
    },
  };
  return { ...popupState, popupRegister: registerCopy };
};

const deregisterPopup = (id: Uid, popupState: IPopupProviderState) => {
  const { popupRegister } = popupState;
  const registerCopy = { ...popupRegister };
  const { deleteRootOnUnmount, root } = registerCopy[id] || {};
  if (deleteRootOnUnmount && root) {
    root.remove();
  }
  delete registerCopy[id];

  return { ...popupState, popupRegister: registerCopy };
};
export enum EPopupRegisterAction {
  OPEN_POPUP = 'OPEN_POPUP',
  CLOSE_POPUP = 'CLOSE_POPUP',
  REGISTER_POPUP = 'REGISTER_POPUP',
  DEREGISTER_POPUP = 'DEREGISTER_POPUP',
}

const openPopup = (id: TPopupId, popupState: IPopupProviderState) => {
  const { popupRegister, popupCount, baseZIndex } = popupState;
  const newItemState: IPopupElementState = popupRegister[id] || getRegisteredPopupItem({id, root: String(id), deleteRootOnUnmount: true, z: 0})
  return {
    ...popupState,
    popupCount: popupCount + 1,
    popupRegister: {
      ...popupRegister,
      [id]: {
        ...newItemState,
        open: true,
        z: baseZIndex + popupCount,
      },
    },
  };
};

const closePopup = (id: TPopupId, popupState: IPopupProviderState) => {
  const { popupRegister, popupCount } = popupState;
  if (popupRegister[id] != undefined) {
    const popupRegisterCopy = {
      ...popupRegister,
      [id]: { ...popupRegister[id], open: false },
    };
    popupRegisterCopy[id].open = false;
    return {
      ...popupState,
      popupCount: popupCount - 1,
      popupRegister: popupRegisterCopy,
    };
  } else {
    throw new Error(
      `Attempted to close popup that isn't registered! Id is ${id}`
    );
  }
};

export interface ActionArgsRegister {
  type: EPopupRegisterAction.REGISTER_POPUP;
  args: IRegisterPopupArgs;
}

export interface ActionArgsDefault {
  type:
    | EPopupRegisterAction.OPEN_POPUP
    | EPopupRegisterAction.CLOSE_POPUP
    | EPopupRegisterAction.DEREGISTER_POPUP;
  args: Uid;
}

export type ActionArgs = ActionArgsRegister | ActionArgsDefault;

export const popupRegisterReducer = (
  popupState: IPopupProviderState,
  action: ActionArgs
): IPopupProviderState => {
  switch (action.type) {
    case EPopupRegisterAction.OPEN_POPUP:
      return openPopup(action.args, popupState);
    case EPopupRegisterAction.CLOSE_POPUP:
      return closePopup(action.args, popupState);
    case EPopupRegisterAction.REGISTER_POPUP:
      return registerPopup(action.args, popupState);
    case EPopupRegisterAction.DEREGISTER_POPUP:
      return deregisterPopup(action.args, popupState);
    default:
      throw new Error();
  }
};

export const PopupProvider = ({
  initialState = defaultState,
  children,
}: IPopupProviderProps) => {
  const [popupState, dispatchPopupRegister] = React.useReducer(
    popupRegisterReducer,
    initialState.state || (EMPTY_OBJECT as IPopupProviderState)
  );
  const openPopupA = React.useCallback(
    (id: Uid) =>
      dispatchPopupRegister({
        type: EPopupRegisterAction.OPEN_POPUP,
        args: id,
      }),
    [dispatchPopupRegister]
  );
  const closePopupA = React.useCallback(
    (id: Uid) =>
      dispatchPopupRegister({
        type: EPopupRegisterAction.CLOSE_POPUP,
        args: id,
      }),
    [dispatchPopupRegister]
  );

  const mergedValue: IPopupPanelContext = {
    ...defaultState,
    ...initialState,
    state: popupState,
    dispatchPopupRegister,
    openPopup: openPopupA,
    closePopup: closePopupA,
  };

  return (
    <PopupPanelContext.Provider value={mergedValue}>
      {children}
    </PopupPanelContext.Provider>
  );
};
