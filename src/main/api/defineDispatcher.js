const returnUndefined = () => {};

export default function defineDispatcher(messageCreators) {
    if (messageCreators === null || typeof messageCreators !== 'object') {
        throw new TypeError(
            "[deriveDispatcher] First argument 'messageCreators' "
                + 'has to be an object');
    }

    const
        keys = Object.keys(messageCreators),
        involvedTypes = {};

    for (let i = 0; i < keys.length; ++i) {
        const
            messageCreator = messageCreators[keys[i]],
            type = messageCreator ? messageCreator.type : null;

        if (type && typeof type === 'string') {
            involvedTypes[type] = true;
        }
    }

    return () => function dispatch(message) {
        let ret;

        if (message
            && typeof message === 'object'
            && typeof message.type === 'string'
            && message.payload
            && typeof message.payload === 'object'
            && typeof message.payload.effect === 'function'
            && involvedTypes[message.type] === true) {

            ret = message.payload.effect({
                dispatch,
                getState: returnUndefined
            });
        }

        return ret;
    };
}