import { MainRuntime } from '@teambit/cli';
import { GeneratorMain, GeneratorAspect, ComponentContext } from '@teambit/generator';
import { FieldTemplateAspect } from './field-template.aspect';

export class FieldTemplateMain {
  static slots = [];
  static dependencies = [GeneratorAspect];
  static runtime = MainRuntime;
  static async provider([generator]: [GeneratorMain]) {

  generator.registerComponentTemplate([
      {
        name: 'form-field-js',
        description: 'base form component',
        generateFiles: (context: ComponentContext) => {
          return [

            // index file
            {
              relativePath: 'index.ts',
              isMain: true,
              content: `export { ${context.namePascalCase} } from './${context.name}';
export type { ${context.namePascalCase}Props } from './${context.name}';
`,
            },
            // demo data file
            {
              relativePath: `demo-data.js`,
              content: 'export const defaultVal = 0;'
            },


            // component file
            {
              relativePath: `${context.name}.tsx`,
              content: `import React from 'react';

export type ${context.namePascalCase}Props = {

  text: string
};

export function ${context.namePascalCase}({ text }: ${context.namePascalCase}Props) {
  return (
    <div>
      {text}
    </div>
  );
}`,
            },

            // docs file
            {
              relativePath: `${context.name}.docs.mdx`,
              content: `---
description: 'A React Form Field Component for editing <TYPE>.'
labels: ['form-field]
---

import { ${context.namePascalCase} } from './${context.name}';


Modify the value to see it change live:
\`\`\`js live
<${context.namePascalCase}
  uid="foo"
  unit="unit"
  defaultValue={3}
  updateFormData={() => {}}
  value={4}
  required
/>
\`\`\`
`
            },

            // composition file
            {
              relativePath: `${context.name}.composition.tsx`,
              content: `import React from 'react';
import { ${context.namePascalCase} } from './${context.name}';

export const Basic${context.namePascalCase}  = () => (
  <${context.namePascalCase}
    uid="foo"
    unit="unit"
    defaultValue={3}
    updateFormData={() => {}}
    value={4}
    required
  />
);
`
            },

            // test file
            {
              relativePath: `${context.name}.spec.tsx`,
              content: `import React from 'react';
import { render } from '@testing-library/react';
import { Basic${context.namePascalCase} } from './${context.name}.composition';

it('should render with the correct value', () => {
  const { getByText } = render(<Basic${context.namePascalCase} />);
  const rendered = getByText('hello from ${context.namePascalCase}');
  expect(rendered).toBeTruthy();
});
`
            },

          ];
        },
      },
    ]);

    return new FieldTemplateMain();
  }
}

FieldTemplateAspect.addRuntime(FieldTemplateMain);
