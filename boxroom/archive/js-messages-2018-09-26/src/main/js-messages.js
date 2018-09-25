import defineDispatcher from './api/defineDispatcher';
import defineEffect from './api/defineEffect';
import defineMessages from './api/defineMessages';
import defineProcess from './api/defineProcess';
import defineStore from './api/defineStore';
import isEffect from './api/isEffect';
import Effects from './api/Effects';

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
    isEffect,
    Effects
};

export default {
    defineDispatcher,
    defineEffect,
    defineMessages,
    defineProcess,
    defineStore,
    isEffect,
    Effects
};
