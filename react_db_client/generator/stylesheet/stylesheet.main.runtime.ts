import { MainRuntime } from '@teambit/cli';
import { GeneratorMain, GeneratorAspect, ComponentContext } from '@teambit/generator';
import { StylesheetAspect } from './stylesheet.aspect';

export class StylesheetMain {
  static slots = [];
  static dependencies = [GeneratorAspect];
  static runtime = MainRuntime;
  static async provider([generator]: [GeneratorMain]) {
  /**
  * Array of templates. Add as many templates as you want
  * Separate the templates to multiple files if you prefer
  * Modify, add or remove files as needed
  * See the docs file of this component for more info
  */

  generator.registerComponentTemplate([
      {
        name: 'scss',
        description: 'Create an scss stylesheet component',
        generateFiles: (context: ComponentContext) => {
          return [

            // index file
            {
              relativePath: 'index.scss',
              isMain: true,
              content: `@import "style";`,
            },

            // component file
            {
              relativePath: `${context.name}.scss`,
              content: `// Add styles here...`,
            },

            // docs file
            {
              relativePath: `${context.name}.docs.mdx`,
              content: `---
description: 'Stylesheet.'
labels: ['styles']
---
`
            },
          ];
        },
      },
    ]);

    return new StylesheetMain();
  }
}

StylesheetAspect.addRuntime(StylesheetMain);
