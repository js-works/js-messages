import { describe, it } from 'mocha';
import { expect } from 'chai';

import defineMessages from '../../main/api/defineMessages';
import deriveDispatcher from '../../main/api/deriveDispatcher';

const
    output = [],

    actions = defineMessages({
        log: (...args) => ({
            effect: () => {
                output.push(args);
            }
        })
    }),

    dispatch = deriveDispatcher(actions);

describe('deriveDispatcher', () => {
    it('should reduce state properly', () => {
        dispatch(actions.log('Woohoo'));

        expect(output).to.deep.eql([['Woohoo']]);
    });
});
