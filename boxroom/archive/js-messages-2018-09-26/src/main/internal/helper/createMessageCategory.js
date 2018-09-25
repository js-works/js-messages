import createMessageFactory from './createMessageFactory';

/**
 * @ignore 
 */
export default function createMessageCategory(config, namespace = null, path = null) {
    const
        ret = {},
        keys = Object.keys(config);

    for (let i = 0; i < keys.length; ++i) {
        const
            key = keys[i],
            name = namespace === null ? key : `${namespace}/${key}`,
            value = config[key];

        if (value === null) {
            ret[key] = createMessageFactory(name, null, null);
        } else if (Array.isArray(value)) {
            ret[key] = createMessageFactory(name, value[0], value[1]);
        } else if (typeof value === 'object') {
            const category = createMessageCategory(value, name, path ? [...path, ret] : [ret]);

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

        if (path && typeof ret[key] === 'function') {
            for (let j = 0; j < path.length; ++j) {
                path[j][key] = ret[key];
            }
        }
    }

    Object.freeze(ret);

    return ret;
}

