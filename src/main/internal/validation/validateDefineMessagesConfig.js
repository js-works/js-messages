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
            Spec.hasKeys,
            Spec.keysOf(Spec.match(REGEX_TYPE_NAME)),
            Spec.valuesOf(
                Spec.shape({
                    validateParams:
                        Spec.optional(    
                            Spec.or(
                                Spec.func,
                                Spec.and(
                                    Spec.object,
                                    Spec.hasKeys,
                                    Spec.keysOf(Spec.match(REGEX_PARAM_NAME)),
                                    Spec.valuesOf(Spec.func)
                                ))),
                    
                    defaultParams:
                        Spec.optional(
                            Spec.and(
                                Spec.object,
                                Spec.keysOf(Spec.match(REGEX_PARAM_NAME)),
                                Spec.valuesOf(Spec.isNot(undefined)))),

                    getPayload:
                        Spec.optional(Spec.func),

                    getMeta:
                        Spec.optional(Spec.func)
                })))
});

export default function validateDefineMessagesConfig(config) {
    return configSpec(config, '');
}
