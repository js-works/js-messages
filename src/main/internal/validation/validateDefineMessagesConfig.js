import { Spec } from 'js-spec';

const
    REGEX_CATEGORY_NAME = /^[a-z][a-zA-Z0-9]*(:[a-z][a-zA-Z0-9]*)*$/,
    REGEX_TYPE_NAME = /^[a-z][a-zA-Z0-9]*$/,
    REGEX_PARAM_NAME = /^[a-z][a-zA-Z0-9]*$/;

const configSpec = Spec.shape({
    category: Spec.match(REGEX_CATEGORY_NAME),

    types:
        Spec.and(
            Spec.object,
            Spec.hasSomeKeys,
            Spec.keysOf(Spec.match(REGEX_TYPE_NAME)),
            Spec.valuesOf(
                Spec.shape({
                    validateParams:
                        Spec.optional(    
                            Spec.or(
                                Spec.validator,
                                Spec.and(
                                    Spec.object,
                                    Spec.hasSomeKeys,
                                    Spec.keysOf(Spec.match(REGEX_PARAM_NAME)),
                                    Spec.valuesOf(Spec.validator)
                                ))),
                    
                    defaultParams:
                        Spec.optional(
                            Spec.and(
                                Spec.object,
                                Spec.keysOf(Spec.match(REGEX_PARAM_NAME)),
                                Spec.valuesOf(Spec.isNot(undefined)))),

                    merge:
                         Spec.optional(Spec.boolean),
                         
                    getPayload:
                        Spec.optional(Spec.function),

                    getMeta:
                        Spec.optional(Spec.function)
                })))
});

export default function validateDefineMessagesConfig(config) {
    return configSpec.validate(config, '');
}
