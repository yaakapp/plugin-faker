import {faker} from '@faker-js/faker';
import {PluginDefinition} from '@yaakapp/api';

const modules = [
    "airline",
    "animal",
    "color",
    "commerce",
    "company",
    "database",
    "date",
    "finance",
    "git",
    "hacker",
    "image",
    "internet",
    "location",
    "lorem",
    "music",
    "person",
    "number",
    "phone",
    "science",
    "string",
    "system",
    "vehicle",
    "word",
];

export const plugin: PluginDefinition = {
    templateFunctions: modules.flatMap(name => {
        // @ts-ignore
        const module = faker[name];
        return Object.keys(module).filter(n => n !== 'faker').map(functionName => ({
            name: ['faker', name, functionName].join('.'),
            args: [],
            async onRender(_ctx, _args) {
                const fakerFunction = module[functionName];
                const result = fakerFunction();
                if (typeof result !== 'string') {
                    return JSON.stringify(result);
                }
                return result;
            },
        }));
    }),
};
