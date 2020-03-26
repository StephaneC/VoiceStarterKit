'use strict';

import { ResponseFactory } from 'ask-sdk-core';
import { HandlerInput, RequestHandler } from 'ask-sdk';
import { Response } from 'ask-sdk-model';
import { notificationsBusiness } from '../commons/notifications/Business';
import { getContentToken } from '../commons/notifications/utils';
import { Plateform } from 'SkillActionLib';

export class SkillEventHandler implements RequestHandler {
    public async canHandle(handlerInput: HandlerInput): Promise<boolean> {
        return handlerInput.requestEnvelope.request.type.startsWith('AlexaSkillEvent')
            || handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    }

    public async handle(handlerInput: HandlerInput): Promise<Response> {

        console.log("SkillEventHandler");
        console.log(JSON.stringify(handlerInput));
        const plateform = new Plateform(handlerInput);
        const eventName = handlerInput.requestEnvelope.request.type;
        const request: any = handlerInput.requestEnvelope.request;

        switch (eventName) {
            case 'AlexaSkillEvent.SkillPermissionAccepted':
                console.log('AlexaSkillEvent.SkillPermissionAccepted');
                console.log(JSON.stringify(request));

                if (request.body &&
                    request.body.acceptedPermissions) {
                    const permissions: [{ scope: string }] = request.body.acceptedPermissions;
                    console.log('Iteration on acceptedPermissions ' + JSON.stringify(request.body.acceptedPermissions));
                    for (const permission of permissions) {
                        if (permission.scope === 'alexa::devices:all:notifications:write') {
                            await notificationsBusiness.subscribe(getContentToken(handlerInput), await plateform.getUserId(), plateform.type);
                        }
                    }
                }
                break;
            case 'AlexaSkillEvent.SkillPermissionChanged':
                console.log('AlexaSkillEvent.SkillPermissionChanged');
                let toUnsubscribeNotif = true;
                if (request.body &&
                    request.body.acceptedPermissions) {
                    const permissions: [{ scope: string }] = request.body.acceptedPermissions;
                    console.log('Iteration on acceptedPermissions ' + JSON.stringify(request.body.acceptedPermissions));
                    for (const permission of permissions) {
                        if (permission.scope === 'alexa::devices:all:notifications:write') {
                            toUnsubscribeNotif = false;
                        }
                    }
                }
                if (toUnsubscribeNotif) {
                    await notificationsBusiness.unsubscribe(getContentToken(handlerInput), await plateform.getUserId(), plateform.type);
                }
                break;
            case 'AlexaSkillEvent.SkillDisabled':
                break;
        }

        return ResponseFactory.init()
            .getResponse();
    }
}