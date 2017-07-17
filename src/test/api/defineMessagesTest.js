import { describe, it } from 'mocha';
import { expect } from 'chai';

import defineMessages from '../../main/api/defineMessages';
import { Spec } from 'js-spec';

const Msgs = defineMessages({
    category: 'todos',
    
    types: {
        addTodo: {
            validateParams: {
                text: Spec.nullable(Spec.string),
                completed: Spec.boolean
            },

            defaultParams: {
                text: '',
                completed: false
            },
        },

        addTodoMerged: {
            validateParams: {
                text: Spec.nullable(Spec.string),
                completed: Spec.boolean
            },

            defaultParams: {
                text: '',
                completed: false
            },

            merge: true
        },

        updateTodo: {
            validateParams: {
                id: Spec.positiveNumber,
                text: Spec.optional(Spec.string),
                completed: Spec.optional(Spec.boolean)
            }
        },

        createErrorPayload: {
            getPayload() {
                return new Error('some error');
            }
        }
    }
});


describe('defineMessages', () => {
    it('should generate corresponding message type constants', () => {
        expect(Msgs.ADD_TODO)
            .to.eql('todos:addTodo');

        expect(Msgs.UPDATE_TODO)
            .to.eql('todos:updateTodo');

        expect(Msgs.CREATE_ERROR_PAYLOAD)
            .to.eql('todos:createErrorPayload');
    });
    
    it('should generate message factories that create valid messages', () => {
        expect(Msgs.addTodo({ text: 'new todo' }))
            .to.deep.eql({
                type: 'todos:addTodo',
                payload: {
                    text: 'new todo',
                    completed: false
                }});

        expect(Msgs.addTodoMerged({ text: 'new todo' }))
            .to.deep.eql({
                type: 'todos:addTodoMerged',
                text: 'new todo',
                completed: false
            });

        expect(Msgs.updateTodo({ id: 123, text: 'updated todo'}))
            .to.deep.eql({
                type: 'todos:updateTodo',
                payload: {
                    id: 123,
                    text: 'updated todo'
                }
            });

        const errorMessage = Msgs.createErrorPayload();

        expect(errorMessage)
            .to.deep.equal({
                type: 'todos:createErrorPayload',
                payload: errorMessage.payload,
                error: true
            });
    });
});
