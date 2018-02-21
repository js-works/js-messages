export default function isEffect(it, name = null) {
    return typeof it === 'function'
        && typeof it.effectName === 'string'
        && Array.isArray(it.effectArgs)
        && (name === null || it.effectName === name);
}

