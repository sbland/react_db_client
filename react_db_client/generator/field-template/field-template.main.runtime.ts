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
              relativePath: 'index.js',
              isMain: true,
              content: `export { ${context.namePascalCase} } from './${context.name}';
`,
            },
            // demo data file
            {
              relativePath: `demo-data.js`,
              content: 'export const defaultVal = 0;'
            },
            // component file
            {
              relativePath: `${context.name}.jsx`,
              content: `import React from 'react';
import PropTypes from 'prop-types';

export function ${context.namePascalCase}({
  uid,
  unit,
  defaultValue,
  updateFormData,
  value,
  required,
}) {
  return (
    <div className="${context.namePascalCase}">
      {value}
    </div>
  );
};

${context.namePascalCase}.propTypes = {
  uid: PropTypes.string.isRequired,
  unit: PropTypes.string,
  value: PropTypes.number,
  updateFormData: PropTypes.func.isRequired,
  required: PropTypes.bool,
  defaultValue: PropTypes.number,
};

${context.namePascalCase}.defaultProps = {
  unit: '',
  value: 0,
  required: false,
  defaultValue: null,
};

`,
            },

            // docs file
            {
              relativePath: `${context.name}.docs.mdx`,
              content: `---
description: 'A React Form Field Component for editing <TYPE>.'
labels: ['form-field', '${context.name.replace('form-', '')}']
---

import { ${context.namePascalCase} } from './${context.name}';

\`\`\`
`
            },

            // composition file
            {
              relativePath: `${context.name}.composition.jsx`,
              content: `import React from 'react';
import { CompositionWrapDefault } from '@samnbuk/react_db_client.helpers.composition-wraps/dist';
import { ${context.namePascalCase} } from './${context.name}';
import { defaultVal, demoOptions } from './demo-data';


const defaultProps = {
  uid: 'uid',
  unit: 'unit',
  value: defaultVal,
  updateFormData,
};


export const Basic${context.namePascalCase}  = () => (
  <CompositionWrapDefault height="4rem" width="8rem">
    <${context.namePascalCase}
      {...defaultProps}
      required
    />
  </CompositionWrapDefault>
);
`
            },

            // test file
            {
              relativePath: `${context.name}.test.js`,
              content: `import '@samnbuk/react_db_client.helpers.enzyme-setup';
import React from 'react';
import { mount, shallow } from 'enzyme';

import { ${context.namePascalCase} } from "./${context.name}";
import * as compositions from './${context.name}.composition';
import { defaultVal } from './demo-data';

const updateFormData = jest.fn();

const defaultProps = {
  uid: 'uid',
  unit: 'unit',
  value: defaultVal,
  updateFormData,
};


describe('${context.name}', () => {
  beforeEach(() => {
    updateFormData.mockClear();
  });
  test('Renders', () => {
    shallow(<${context.namePascalCase} {...defaultProps} />);
  });

  describe('Compositions', () => {
    Object.entries(compositions).forEach(([name, Composition]) => {
      test(name, () => {
        mount(<Composition />);
      });
    });
  });
  describe('shallow renders', () => {
    test('Matches Snapshot', () => {
      const component = shallow(<${context.namePascalCase} {...defaultProps} />);
      const tree = component.debug();
      expect(tree).toMatchSnapshot();
    });
  });
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
