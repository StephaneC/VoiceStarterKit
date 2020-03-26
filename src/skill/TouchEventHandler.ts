'use strict';

import { ResponseFactory } from 'ask-sdk-core';
import { HandlerInput, RequestHandler } from 'ask-sdk';
import { Response } from 'ask-sdk-model';
import { TouchEvent } from '../commons/Constants';

import {
    actionTouched
} from '../commons/Intent.business';
import { Plateform } from 'SkillActionLib/dist';

export class TouchEventHandler implements RequestHandler {
    public async canHandle(handlerInput: HandlerInput): Promise<boolean> {
        return handlerInput.requestEnvelope.request.type.startsWith('Display.ElementSelected') || handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    }

    public async handle(handlerInput: HandlerInput): Promise<Response> {
        console.log('Touch event - ' + handlerInput.requestEnvelope.context.Display.token);
        const p = new Plateform(handlerInput);
        await actionTouched(p);
        return Promise.resolve(handlerInput.responseBuilder.getResponse());
    }
}