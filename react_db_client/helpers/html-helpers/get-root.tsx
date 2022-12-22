import React from 'react';

export const getRoot = (inputRoot: string | HTMLElement, id: string) => {
  let root: null | HTMLElement = null;
  const _id: string = typeof inputRoot === 'string' ? inputRoot : id || '_root';
  if (typeof inputRoot == 'object') root = inputRoot;
  if (typeof inputRoot == 'string') root = document.getElementById(inputRoot);
  if (!root) {
    root = document.createElement('div');
    root.setAttribute('id', _id);
    document.body.appendChild(root);
  }
  return root;
};

const getRootData = (inputRoot: string | HTMLElement, id: string) => {
  let deleteOnUnmount = false;
  let root: null | HTMLElement = null;
  const _id: string = typeof inputRoot === 'string' ? inputRoot : id || '_root';
  if (typeof inputRoot == 'object') root = inputRoot;
  if (typeof inputRoot == 'string') root = document.getElementById(inputRoot);
  if (!root) {
    deleteOnUnmount = true;
    root = document.createElement('div');
    root.setAttribute('id', _id);
    document.body.appendChild(root);
  }
  return { root, deleteOnUnmount };
};

export interface IRootData {
  root: HTMLElement;
  deleteOnUnmount: boolean;
}

export const useGetRoot = (inputRoot: string | HTMLElement, id: string) => {
  const [root] = React.useState<IRootData>(() => getRootData(inputRoot, id));

  React.useEffect(() => {
    let _rootData = root;
    return () => {
      if (_rootData.deleteOnUnmount && _rootData.root) {
        _rootData.root.remove();
      }
    };
  }, [id, inputRoot, root]);
  return root?.root;
};

// export const useGetRoot = (inputRoot: string | HTMLElement, id: string) => {
//   const [root, setRoot] = React.useState<HTMLElement | null>(null);

//   React.useEffect(() => {
//     // const _deleteRootOnUnmount = deleteRootOnUnmount;
//     let rootToDelete: HTMLElement | null = null;
//     if (!root) {
//       let newRoot: HTMLElement | null = null;
//       if (typeof inputRoot == 'object') {
//         newRoot = inputRoot;
//       }
//       if (typeof inputRoot == 'string') {
//         newRoot = document.getElementById(inputRoot);
//       }
//       if (!newRoot) {
//         newRoot = document.createElement('div');
//         rootToDelete = newRoot;
//         const _id = typeof inputRoot === 'string' ? inputRoot : id || '_root';
//         newRoot.setAttribute('id', _id);
//         document.body.appendChild(newRoot);
//       }
//       setRoot(newRoot);
//     }
//     return () => {
//       if (rootToDelete) {
//         rootToDelete.remove();
//       }
//     };
//   }, [id, inputRoot, root]);
//   return root;
// };
