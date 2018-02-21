import isEffect from './isEffect';

export default function deriveStore(messageCreators, createState = null) {
    if (messageCreators === null
        || typeof messageCreators !== 'object') {

        throw new TypeError(
            "[deriveStore] First argument 'messageCreators' "
                + 'has to be an object');
    } else if (createState !== null && typeof createState !== 'function') {
        throw new TypeError(
            "[deriveStore] Optional second argument 'createState' "
                + 'must be a function');
    }

    const
        involvedTypes = {},

        creatorsArray =
            Array.isArray(messageCreators)
                ? messageCreators
                : [messageCreators];

    for (let i = 0; i < creatorsArray.length; ++i) {
        const creators = creatorsArray[i];

        if (creators !== undefined && typeof creators !== 'object') {
            throw new TypeError('[deriveStore] Messages creator at index '
                + i + ' must be an object');
        }

        const keys = Object.keys(creators);

        for (let j = 0; j < keys.length; ++j) {
            const
                creator = creators[keys[j]],
                type = creator ? creator.type : null;

            if (type && typeof type === 'string') {
                involvedTypes[type] = true;
            }
        }
    }

    return (...args) => {
        let
            state = createState === null ? args[0] : createState(...args),
            listeners = [],
            receivers = [];

        const
            store = Object.freeze({
                getState() {
                    return state;
                },

                subscribe(listener) {
                    const receiver = listener.bind(null);

                    listeners.push(receiver);

                    return () => {
                        listeners = listeners.filter(it => it !== receiver);
                    };
                },

                dispatch(message) {
                    let ret = null;

                    if (isEffect(message)) {
                        ret = message(subject);
                    } else if (message
                        && involvedTypes[message.type] === true
                        && typeof message === 'object'
                        && typeof message.type === 'string'
                        && message.payload !== null 
                        && typeof message.payload === 'object') {
                        
                        let newState = state;

                        if (typeof message.payload.update === 'function') {
                            newState = message.payload.update(state, message);

                            if (newState !== state) {
                                state = newState;

                                for (let i = 0; i < listeners.length; ++i) {
                                    listeners[i]();
                                }
                            }
                        }
                        
                        if (typeof message.payload.effect === 'function') {
                            ret = message.payload.effect(subject);
                        }
                    }

                    for (let i = 0; i < receivers.length; ++i) {
                        receivers[i](message);
                    }

                    return ret;
                } 
            }),

            subject = Object.freeze({
                dispatch: store.dispatch,
                getState: store.getState,

                registerReceiver: receiver => {
                    const observer = receiver.bind();

                    receivers.push(observer);

                    return () => {
                        receivers = receivers.filter(it => it !== observer);
                    };
                }
            });
        
        return store;
    };
}

