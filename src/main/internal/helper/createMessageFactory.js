import createParamsValidator from './createParamsValidator';

export default function createMessageFactory(fullTypeName, messageConfig) {
    const
        { defaultParams, getPayload, getMeta } = messageConfig,
        
        validateParams =
            createParamsValidator(messageConfig.validateParams);
        

    return params => {
        const adjustedParams = defaultParams
            ? Object.assign({}, defaultParams, params)
            : params;

        if (validateParams) {
            const error = validateParams(adjustedParams);

            if (error) {
                throw new Error(
                    "Illegal parameters for message of type '"
                    + fullTypeName
                    + ': '
                    + error.message);
            }
        }

        const
            payload = getPayload ? getPayload(adjustedParams) : adjustedParams,

            ret = { type: fullTypeName, payload };

        if (payload instanceof Error) {
            ret.error = true;
        }

        if (messageConfig.getMeta) {
            ret.meta = getMeta(adjustedParams);
        }

        ret.type = fullTypeName;

        Object.freeze(ret);

        return ret;
    };
}
