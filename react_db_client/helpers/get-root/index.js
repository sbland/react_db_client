export const getRoot = (inputRoot) => {
  let root = null;
  if (typeof inputRoot === 'object') root = inputRoot;
  if (typeof inputRoot === 'string') root = document.getElementById(inputRoot);
  if (!root) {
    root = document.createElement('div');
    root.setAttribute('id', inputRoot || '_root');
    document.body.appendChild(root);
  }
  return root;
};
