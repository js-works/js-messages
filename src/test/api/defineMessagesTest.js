import { describe, it } from 'mocha';
import { expect } from 'chai';

import defineMessages from '../../main/api/defineMessages';
import { Spec } from 'js-spec';

const
    Msg1 = defineMessages({
        increment: [
            [ Spec.integer ],
            delta => ({ delta })
        ],
        reset: null,

        sub1: {
            sub2: {
                xxx: () => ({ payload: undefined, meta: undefined })
            }
        }
    });


describe('defineMessages', () => {
    it('should generate message factories that create valid messages', () => {

        console.log(Msg1.increment.type);
        console.log(Msg1.increment(10));

        process.exit(0);
        /*
        expect(Msgs.addTodo({ text: 'new todo' }))
            .to.deep.eql({
                type: 'todos:addTodo',
                payload: {
                    text: 'new todo',
                    completed: false
                }});
        */
    });
});
