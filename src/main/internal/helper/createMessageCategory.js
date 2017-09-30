import createMessageFactory from './createMessageFactory';

/**
 * @ignore 
 */
export default function createMessageCategory(config, namespace = null) {
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
            ret[key] = createMessageCategory(value, name);
        } else if (typeof value === 'function') {
            ret[key] = createMessageFactory(name, null, value);
        } else {
            // This will never happen
            throw new Error('[createMessageCategory] Unkown property type ... this should never happen');
        }
    }

    Object.freeze(ret);

    return ret;
}

