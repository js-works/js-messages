import validateDefineMessagesConfig
    from '../internal/validation/validateDefineMessagesConfig';

import toConstantCase
    from '../internal/helper/toConstantCase';

import createMessageFactory
    from '../internal/helper/createMessageFactory';


export default function defineMessages(config) {
    const
        ret = {},    
        error = validateDefineMessagesConfig(config);
console.log(config);
//process.exit(0)
    if (error) {
        throw new Error('[defineMessages] Illegal first argument '
            + "'config': " + error.message);
    }

    for (let typeName of Object.keys(config.types)) {
        const
            typeConstantName = toConstantCase(typeName),
            messageConfig = config.types[typeName],
            fullTypeName = `${config.category}:${typeName}`;

        ret[typeConstantName] = fullTypeName;
        ret[typeName] = createMessageFactory(fullTypeName, messageConfig);        
    }

    return ret;
}