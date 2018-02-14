export default function deriveMiddleware(messageCreators) {
    if (messageCreators === null || typeof messageCreators !== 'object') {
        throw new TypeError(
            "[deriveMiddleware] First argument 'messageCreators' "
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

    return subject => next => message => {
        let ret;

        if (message
            && typeof message === 'object'
            && typeof message.type === 'string'
            && typeof message.payload === 'function'
            && involvedTypes[message.type] === true) {

            ret = message.payload(subject);
        } else {
            ret = next(message);
        }

        return ret;
    };
}
