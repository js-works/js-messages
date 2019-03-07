import createMessageCategory
    from '../internal/helper/createMessageCategory';

import validateMessagesConfig
    from '../internal/validation/validateMessagesConfig';
/**
 * 
 * @param {object} config 
 */
export default function defineMessages(config) {
    const error = validateMessagesConfig(config);

    if (error) {
        if (typeof console === 'object' && console && console.error) {
            console.error('[defineMessages] Innvalid configuration:', config);
        } 

        throw new Error(`[defineMessages] ${error.message}`);
    }

    return createMessageCategory(config); 
}
