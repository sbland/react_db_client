export const getRoot = (inputRoot: string | HTMLElement, id: string) => {
  let root: null | HTMLElement = null;
  const _id: string = typeof inputRoot === "string" ? inputRoot : id || "_root";
  if (typeof inputRoot == 'object') root = inputRoot;
  if (typeof inputRoot == 'string') root = document.getElementById(inputRoot);
  if (!root) {
    root = document.createElement('div');
    root.setAttribute('id', _id);
    document.body.appendChild(root);
  }
  return root;
};
