const REGEX_KEY_NAME = /^[a-z][a-zA-Z0-9]*(:[a-z][a-zA-Z0-9]*)*$/;

/**
 * @ignore 
 */
export default function validateMessagesConfig(config, fullKey = null) {
    let
        ret = null,
        errorMsg = null,
        hasFactory = false,
        hasCategory = false;

    if (!config || typeof config !== 'object') {
        errorMsg = 'Configuration of messages must be an object';
    } else {
        const
            keys = Object.keys(config),
            firstInvalidKey = keys.find(key => !key.match(REGEX_KEY_NAME));

        if (firstInvalidKey !== undefined) {
            errorMsg = 'Invalid key "${firstInvalidKey}';
        } else {
            for (let i = 0; i < keys.length; ++i) {
                const
                    key = keys[i],
                    fullKey = fullKey ? `${fullKey}.${key}` : key,
                    value = config[key],
                    typeOfValue = typeof value;

                if (typeOfValue !== 'object' && typeOfValue !== 'function') {
                    errorMsg = `Configuration of key "${fullKey}" `
                        + 'must either be a function, and object or null';
                } else if (Array.isArray(value)) {
                    const error = validatePayloadCreatorConfig(value, fullKey);

                    errorMsg = error ? error.message : null;
                } else if (value !== null && typeOfValue !== 'function') {
                    const error = validateMessagesConfig(value, fullKey);

                    errorMsg = error ? error.message : null;
                }

                if (errorMsg) {
                    break;
                } else if (value === null
                    || typeOfValue === 'function'
                    || Array.isArray(value)) {

                    hasFactory = true;
                } else {
                    hasCategory = true;
                }
            }
        }
    }

    if (errorMsg) {
        ret = new Error(errorMsg);
    } else if (hasFactory && hasCategory) {
        ret = new Error(
            'Not allowed to have message factories and message categories '
                + 'both at once at the '
                + (!fullKey ? 'root node' : 'same node ' + fullKey));
    }

    return ret;
}

function validatePayloadCreatorConfig(payloadCreatorConfig, fullKey) {
    let
        ret = null,
        errorMsg = null;
    
    // already checked that valueConfig is an array
    if (payloadCreatorConfig.length !== 2) {
        errorMsg = `Configuration array for "${fullKey}" `
            + 'must contain extactly two elements';
    } else {
        const [constraints, payloadCreator] = payloadCreatorConfig;

        if (typeof constraints !== 'object') {
            errorMsg = `First element in configuration array for "${fullKey}" `
                + 'must either be an object or null';
        } else if (typeof payloadCreator !== 'function') {
            errorMsg = `Second element in configuration array for "${fullKey}" `
                + 'must be a function';
        } else if (constraints) {
            const keys = Object.keys(constraints);

            for (let i = 0; i < keys.length; ++i) {
                const
                    key = keys[i],
                    validator = constraints[key];

                if (validator !== null
                    && typeof validator !== 'function'
                    && (typeof validator !== 'object'
                        || typeof validator.validate !== 'function')) {

                    errorMsg = `Property with key "${i}" of first element of `
                        + `configuration array for "${fullKey}" `
                        + 'must either be a valid validator or null';
                    
                    break;
                }
            }
        }
    }

    if (errorMsg) {
        ret = new Error(errorMsg);
    }

    return ret;
}
