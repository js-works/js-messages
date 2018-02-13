import { describe, it } from 'mocha';
import { expect } from 'chai';

import defineMessages from '../../main/api/defineMessages';
import deriveReducer from '../../main/api/deriveReducer';

const
    actions = defineMessages({
        updates: {
            increment: (delta = 1) => state =>
                ({ value: state.value + delta })
        }
    }),

    reducer = deriveReducer(actions.updates);

describe('deriveReducer', () => {
    it('should reduce state properly', () => {
        expect(reducer({ value: 42 }, actions.increment()))
            .to.eql({ value: 43 });
        
        expect(reducer({ value: 42 }, actions.increment(10)))
            .to.eql({ value: 52 });
    });
});
