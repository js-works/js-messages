/**
 * @ignore 
 */
export default function createMessageFactory(
    type, validateArgs, payloadCreator) {
    
    let validator = null;

    if (validateArgs) {
        if (validateArgs === null) {
            validator = () => null; // TODO
        } else {
            const
                keys = Object.keys(validateArgs),
                isArray = Array.isArray(validateArgs);

            validator = (args) => {
                const subject = isArray ? args : args[0];

                let errorMsg = null;

                for (let i = 0; i < keys.length; ++i) {
                    const
                        key = keys[i],
                        checker = validateArgs[key],
                        value = subject ? subject[key] : undefined;
                
                    let checkResult = null;

                    if (typeof checker === 'function') {
                        checkResult = checker(value);
                    } else if (checker !== null) {
                        checkResult = checker.validate(value);
                    }

                    if (checkResult instanceof Error && checkResult.message) {
                        errorMsg = String(checkResult.message);
                    } else if (checkResult && checkResult !== true) {
                        errorMsg = String(checkResult);
                    }

                    if (ret === false || errorMsg !== null) {
                        errorMsg = String(errorMsg || '').trim();

                        if (errorMsg.length === 0) {
                            errorMsg = 'Illegal value';
                        }

                        errorMsg =
                            (isArray 
                                ? `Validation error for argument index ${key}`
                                : `Validation error for property "${key}"`)
                            + ' => ' + errorMsg;

                        break;
                    }
                }

                return errorMsg ? new Error(errorMsg) : null;
            };
        }
    }

    const ret = function (...args) {
        if (validator) {
            const error = validator(args);

            if (error) {
                throw new Error(`[Message "${type}"] Wrong arguments for messaage factory => ${error.message}`);
            }
        }

        const message = { type };

        if (typeof payloadCreator === 'function') {
            const result = payloadCreator(...args);

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

    ret.toString = () => type;

    Object.defineProperty(ret, 'type', { get: () => type });
    Object.freeze(ret);

    return ret;
}
