import { describe, it } from 'mocha';
import { expect } from 'chai';

import defineMessages from '../../main/api/defineMessages';
import defineDispatcher from '../../main/api/defineDispatcher';

const
    output = [],

    actions = defineMessages({
        log: (...args) => ({
            effect: () => {
                output.push(args);
            }
        })
    }),

    dispatch = defineDispatcher(actions)();

describe('deriveDispatcher', () => {
    it('should reduce state properly', () => {
        dispatch(actions.log('Woohoo'));

        expect(output).to.deep.eql([['Woohoo']]);
    });
});
