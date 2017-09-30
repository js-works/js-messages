import { Spec } from 'js-spec';

const REGEX_KEY_NAME = /^[a-z][a-zA-Z0-9]*(:[a-z][a-zA-Z0-9]*)*$/;

const configSpec =
    Spec.and(
        Spec.object,

        Spec.keysOf(
            Spec.match(REGEX_KEY_NAME)),

        Spec.valuesOf(
            Spec.or(
                Spec.is(null),
                Spec.function,
                {
                    when: Spec.array,
                    
                    check:
                        Spec.and(
                            Spec.prop('length', Spec.is(2)),

                            Spec.prop(0,
                                Spec.or(
                                    Spec.validator,
                                    {
                                        when: Spec.array,
                                        check: Spec.arrayOf(Spec.validator)
                                    },
                                    {
                                        when: Spec.object,
                                    
                                        check:
                                            Spec.and(
                                                Spec.keysOf(Spec.match(REGEX_KEY_NAME)),
                                                Spec.valuesOf(Spec.validator))
                                    })),

                            Spec.prop(1, Spec.function))
                },
                {
                    when: Spec.object,
                    check: Spec.lazy(() => configSpec)
                })
        )
    );

/**
 * @ignore 
 */
export default function validateMessagesConfig(config) {
    return configSpec.validate(config);
}
