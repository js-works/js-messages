import { describe, it } from 'mocha';
import { expect } from 'chai';

import defineMessages from '../../main/api/defineMessages';
import { Spec } from 'js-spec';

const
    Msg1 = defineMessages({
        sub1: {
            increment: [
                null,
                ({ delta }) => ({ delta })
            ],

            reset: null
        },

        sub2: {
            sub3: {
                xxx: () => ({ payload: undefined, meta: undefined })
            }
        }
    });

describe('defineMessages', () => {
    it('should generate message factories that create valid messages', () => {
        console.log(Msg1.increment({ delta: 1 }));
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
