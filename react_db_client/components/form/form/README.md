# React Form component

## Example

```
<Form
  headings={[
    { uid: 'uid', label: 'Project Number', type: 'text' },
    { uid: 'name', label: 'Project Name', type: 'text' },
    { uid: 'setup-date', label: 'Setup Date', type: 'date' },
    {
      uid: 'rep',
      label: 'Rep',
      type: 'select',
      options: [
        { uid: 'rep1', label: 'Rep 1' },
        { uid: 'rep2', label: 'Rep 2' },
      ],
    },
    {
      uid: 'estimator',
      label: 'Estimator',
      type: 'selectMulti',
      options: [
        { uid: 'rep1', label: 'Rep 1' },
        { uid: 'rep2', label: 'Rep 2' },
      ],
    },
    { uid: 'header-footer', label: 'Header/Footer', type: 'text' },
  ]}
  formDataInitial={demoFormData}
  onSubmit={(data) => console.log(data)}
/>

```

## Prop Types

- `formDataInitial`: PropTypes.shape().isRequired,
  This should match the headings
- `headings`: PropTypes.arrayOf(PropTypes.shape({
  - `uid`: PropTypes.string.isRequired,
  - `label`: PropTypes.string.isRequired,
  - `type`: - 'reference', - 'file', - 'textLong', - 'text', - 'number', - 'date', - 'bool', - 'select', - 'selectMulti',
    ]).isRequired,
    })).isRequired,
- `onSubmit`: PropTypes.func.isRequired, // Returns Full form data
- `onChange`: PropTypes.func, // returns edited data as (field, value)
- `showEndBtns`: PropTypes.bool,
