import { isSpecValidator, Spec } from 'js-spec';

const returnNull = () => null;

export default function createParamsValidator(validateParamsConfig) {
    // Argument validateParamsCofig has already been validated
    // and is surely either nothing, a function or an valid object
    let ret = null;

    if (!validateParamsConfig) {
        ret = returnNull;
    } else if (typeof validateParamsConfig === 'object') {
        const spec = Spec.shape(validateParamsConfig);

        ret = it => spec(it, '');
    } else {
        const validate = isSpecValidator(validateParamsConfig)
            ? it => validateParamsConfig(it, '')
            : validateParamsConfig;

        ret = it => {
            const result = validate(it);

            return result === true
                || result === undefined
                || result === null

                ? null
                : (result instanceof Error 
                    ? result.message
                    : String(result));
        };
    }

    return ret;
}
