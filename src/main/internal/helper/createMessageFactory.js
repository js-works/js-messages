/* global self */

import { Spec, SpecValidator } from 'js-spec';

let globalSpace = null;

if (typeof self === 'object' && self && self.Math) {
    globalSpace = self;
} else if (typeof window === 'object' && window && window.Math) {
    globalSpace = window;
} else if (typeof global === 'object' && global && global.Math) {
    globalSpace = global;
}

export default function createMessageFactory(type, validateArgs, provider) {
    let argsValidator = null;

    if (validateArgs) {
        if (validateArgs instanceof SpecValidator) {
            argsValidator = validateArgs;
        } else if (typeof validateArgs === 'function') {
            argsValidator = SpecValidator.from(validateArgs);
        } else if (Array.isArray(validateArgs)) {
            argsValidator = Spec.shape(validateArgs); 
        } else if (typeof validateArgs === 'object') {
            argsValidator = Spec.struct({ 0: Spec.shape(validateArgs) });
        }
    }

    const ret = function (...args) {
        if (argsValidator && globalSpace && globalSpace.debug !== false) {
            const error = argsValidator.validate(args);

            if (error) {
                throw new Error(`[Message ${type}] Wrong arguments for messaage factory => ${error.message}`);
            }
        }

        const message = { type };

        if (typeof provider === 'function') {
            const result = provider(...args);

            if (result !== null && typeof result === 'object'
                && result.constructor === Object
                && (result.hasOwnProperty('payload') || result.hasOwnProperty('meta'))) {
                
                const
                    payload = result.payload,
                    meta = result.meta,
                    keys = Object.keys(result),
                    firstKey = keys[0],
                    secondKey = keys[1];

                if (keys.length === 1 && (firstKey === 'payload' || firstKey === 'meta')
                        || keys.length === 2 && (firstKey === 'payload' || firstKey === 'meta')
                            && (secondKey === 'payload' || secondKey === 'meta')) {

                    if (payload !== undefined) {
                        message.payload = payload;
                    }
                    
                    if (meta !== undefined && meta !== null) {
                        message.meta = meta;
                    }
                } else {
                    message.payload = result;
                    // throw new Error(`[Message ${type}] Factory did return illegal value`);
                }
            } else if (result !== undefined) {
                message.payload = result;
            }
        }

        if (message.payload instanceof Error) {
            message.error = true;
        }

        Object.freeze(message);

        return message;
    };

    ret.type = type;
    Object.freeze(ret);

    return ret;
}
