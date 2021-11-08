import { MainRuntime } from '@teambit/cli';
import { GeneratorMain, GeneratorAspect, ComponentContext } from '@teambit/generator';
import { HelperAspect } from './helper.aspect';

export class HelperMain {
  static slots = [];
  static dependencies = [GeneratorAspect];
  static runtime = MainRuntime;
  static async provider([generator]: [GeneratorMain]) {

  generator.registerComponentTemplate([
    {
        name: 'helper-js',
        description: 'javascript helper library',
        generateFiles: (context: ComponentContext) => {
          return [

            // index file
            {
              relativePath: 'index.js',
              isMain: true,
              content: `export {} from '';
`,
            },
          ]
        }
      }
    ]);

    return new HelperMain();
  }
}

HelperAspect.addRuntime(HelperMain);
