export default function defineEffect(name, thunkCreator) {
    return (...args) => {
        const ret = thunkCreator(...args);
        
        ret.effectName = name;
        ret.effectArgs = args;

        Object.freeze(ret);
        
        return ret;
    };
}
