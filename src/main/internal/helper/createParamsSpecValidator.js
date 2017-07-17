import { Spec, SpecValidator } from 'js-spec';

export default function createParamsSpecValidator(validateParamsConfig) {
    // Argument validateParamsCofig has already been validated.
    // No need to validate it again.
    let ret = null;

    if (!validateParamsConfig) {
        ret = Spec.any;
    } else if (typeof validateParamsConfig === 'object') {
        ret = Spec.shape(validateParamsConfig);
    } else if (validateParamsConfig instanceof SpecValidator) {
        ret = validateParamsConfig;
    } else {
        ret = SpecValidator.from(validateParamsConfig);
    }

    return ret;
}
