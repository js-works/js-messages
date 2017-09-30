import { describe, it } from 'mocha';
import { expect } from 'chai';

import validateMessagesConfig from '../../../main/internal/validation/validateMessagesConfig';
import { Spec } from 'js-spec';

describe('validateMessagesConfig', () => {
    it('should identify invalid messages config', () => {
        
        const result = validateMessagesConfig({
            x: {
                y: {
                    z: [() => true, () => true]
                },
                z: [
                    { 1: Spec.string, 4: Spec.integer },
                    () => true
                ] 
            },
            y: () => null
        });

        expect(result).to.be.null;
    });
});
