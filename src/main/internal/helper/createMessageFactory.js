import createParamsSpecValidator from './createParamsSpecValidator';

export default function createMessageFactory(fullTypeName, messageConfig) {
    const
        { defaultParams, getPayload = null, getMeta = null, merge = false } = messageConfig,
        
        paramsSpecValidator =
            createParamsSpecValidator(messageConfig.validateParams);
        
    return params => {
        const
            adjustedParams = defaultParams
                ? Object.assign({}, defaultParams, params)
                : params,

            error = paramsSpecValidator.validate(adjustedParams);

        if (error) {
            throw new Error(
                "Illegal parameters for message of type '"
                + fullTypeName
                + ': '
                + error.message);
        }

        const
            payload = getPayload ? getPayload(adjustedParams) : adjustedParams,
            meta = getMeta ? getMeta(adjustedParams): null,
            ret = merge ? { type: fullTypeName } : { type: fullTypeName, payload };

        if (merge) {
            if (payload !== undefined && payload !== null && typeof payload !== 'object') {
                throw new Error('Return value of function getPayload must be an object or null or undefined');
            } else if (typeof payload[Symbol.iterator] === 'function') {
                throw new Error('Return value of function getPayload must not be an iterable');
            }
        } else if (payload instanceof Error) {
            ret.error = true;
        }

        if (meta !== undefined && meta !== null) {
            if (typeof meta !== 'object') {
                throw new Error('Return value of function getMeta must be an object or null or undefined');
            } else if (typeof meta[Symbol.iterator] === 'function') {
                throw new Error('Return value of function getMeta must not be an iterable');
            }

            if (!merge) {
                ret.meta = meta;
            }
        }

        ret.type = fullTypeName;

        if (merge) {
            Object.assign(ret, meta, payload);
        }

        Object.freeze(ret);

        return ret;
    };
}
