export default function deriveReducer(messageCreators, defaultValue) {
    if (messageCreators === null || typeof messageCreators !== 'object') {
        throw new TypeError(
            "[deriveReducer] First argument 'messageCreators' "
                + 'has to be an object');
    } else if (defaultValue !== undefined
        && (defaultValue === null || typeof defaultValue !== 'object')) {

        throw new TypeError(
            "[deriveReducer] Optional second argument 'defaultValue' "
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

    return (state = defaultValue, message) => {
        let ret = state;

        if (message
            && typeof message === 'object'
            && typeof message.type === 'string'
            && typeof message.payload === 'function'
            && involvedTypes[message.type] === true) {

            ret = message.payload(state, message);
        }

        return ret;
    };
}
