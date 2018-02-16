import { describe, it } from 'mocha';
import { expect } from 'chai';

import defineMessages from '../../main/api/defineMessages';
import defineStore from '../../main/api/defineStore';

const
    output = [],

    createState = (counter = 0) => ({ counter }),

    actions = defineMessages({
        increment: (delta = 1) =>({
            update: state => ({ counter: state.counter + delta })
        }),

        log: (...args) => ({
            effect: () => {
                output.push(args);
            }
        })
    }),

    createStore = defineStore(actions, createState),
    store = createStore();

describe('deriveDispatcher', () => {
    it('should handle side effects properly', () => {
        store.dispatch(actions.log('Woohoo'));

        expect(output).to.deep.eql([['Woohoo']]);
    });

    it('should reduce state properly', () => {
        expect(store.getState()).deep.eql({ counter: 0 });
        store.dispatch(actions.increment());
        expect(store.getState()).deep.eql({ counter: 1 });
        store.dispatch(actions.increment(99));
        expect(store.getState()).deep.eql({ counter: 100 });
    }),

    it('should be subscribable', () => {
        let callbackCounter = 0;

        const unsubscribe = store.subscribe(() => ++callbackCounter);

        expect(callbackCounter).to.eql(0);
        store.dispatch(actions.increment());
        expect(callbackCounter).to.eql(1);
        unsubscribe();
        store.dispatch(actions.increment());
        expect(callbackCounter).to.eql(1);
    });
});
