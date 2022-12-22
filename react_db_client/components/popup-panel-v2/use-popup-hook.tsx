// import React from 'react';
// import { Uid } from "@react_db_client/constants.client-types";
// import { PopupPanelContext } from './popup-panel-provider';

// export interface IUsePopupArgs {
//   id: Uid;
// }

// export interface IUsePopupReturn {

// }


// export const usePopup = (): IUsePopupReturn=> {
//   const [id, setId]= React.useState(null);
//   const { registerPopup, deregisterPopup, baseZIndex, popupRegister, closePopup } =
//     React.useContext(PopupPanelContext);

//   React.useEffect(() => {
//     const newId = registerPopup(null, popupRoot, deleteRootOnUnmount, zIndex);
//     return () => {
//       deregisterPopup(id);
//     };
//   }, []);


// return {

//   openPopup: (id: TPopupId) => void;
//   closePopup: (id: TPopupId) => void;
// }
// }