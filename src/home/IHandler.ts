'use strict';

import { DialogflowConversation } from 'actions-on-google';

export interface IHandler {
    [key : string] : (conv : DialogflowConversation) => Promise<any>;
}