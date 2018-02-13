import createMessageFactory from './createMessageFactory';

/**
 * @ignore 
 */
export default function createMessageCategory(config, namespace = null, root = null) {
    const ret = {};

    for (const key of Object.keys(config)) {
        const
            name = namespace === null ? key : `${namespace}/${key}`,
            value = config[key];

        if (value === null) {
            ret[key] = createMessageFactory(name, null, null);
        } else if (Array.isArray(value)) {
            ret[key] = createMessageFactory(name, value[0], value[1]);
        } else if (typeof value === 'object') {
            const category = createMessageCategory(value, name, root ? root : ret);

            Object.defineProperty(ret, key, {
                enumerable: false,
                get: () => category
            });
        } else if (typeof value === 'function') {
            ret[key] = createMessageFactory(name, null, value);
        } else {
            // This will never happen
            throw new Error('[createMessageCategory] Unkown property type ... this should never happen');
        }

        if (root !== null && typeof ret[key] === 'function') {
            root[key] = ret[key];
        }
    }

    Object.freeze(ret);

    return ret;
}

