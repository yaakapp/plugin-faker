import {faker} from '@faker-js/faker';
import {PluginDefinition} from '@yaakapp/api';

const modules = Object.keys(faker).filter(key => !key.startsWith('_') && !['definitions', 'rawDefinitions'].includes(key));

export const plugin: PluginDefinition = {
  templateFunctions: modules.flatMap(name => {
    // @ts-ignore
    const module = faker[name];
    return Object.keys(module).filter(n => n !== 'faker' && typeof module[n] === 'function').map(functionName => {
      const fakerFunction = module[functionName];
      return {
        name: ['faker', name, functionName].join('.'),
        args: Array.from({length: fakerFunction.length}, (_, i) => ({name: `arg${i+1}`, type: 'text', label: `Argument ${i+1}`})),
        async onRender(_ctx, _args) {
          const argsArray: any[] = [];
          for (let i = 0; i < fakerFunction.length; i++) {
            const argValue = _args.values[`arg${i+1}`];
            if (argValue === undefined) {
              return `Argument ${i+1} is required for faker.${name}.${functionName}`;
            }
            argsArray.push(JSON.parse(argValue as string));
          }
          const result = fakerFunction(...argsArray);
          if (typeof result !== 'string') {
            return JSON.stringify(result);
          }
          return result;
        },
      };
    });
  }),
};
