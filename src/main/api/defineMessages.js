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
        throw new Error(`[defineMessages] ${error.message}`);
    }

    return createMessageCategory(config);     
}
