import defineDispatcher from './api/defineDispatcher';
import defineEffect from './api/defineEffect';
import defineMessages from './api/defineMessages';
import defineProcess from './api/defineProcess';
import defineStore from './api/defineStore';
import isEffect from './api/isEffect';

// Symbol.obserable polyfil
if (typeof Symbol === 'function') {
    if (!Symbol.observable) {
        Symbol.observable = Symbol('observable');
    }
}

export {
    defineDispatcher,
    defineEffect,
    defineMessages,
    defineProcess,
    defineStore,
    isEffect
};

export default {
    defineDispatcher,
    defineEffect,
    defineMessages,
    defineProcess,
    defineStore,
    isEffect
};
