import { HandlerInput } from 'ask-sdk';
import { RequestEnvelope } from 'ask-sdk-model';

class AttributesManager {

    sessionAttributes = {};
    storageAttributes = {};

    constructor(){}

    public getPersistentAttributes() {
        return this.storageAttributes;
    }

    public getSessionAttributes() {
        return this.sessionAttributes;
    }

    public setPersistentAttributes(sessionAttributes: {
        [key: string]: any;
    }) {
        this.storageAttributes = sessionAttributes;        
    }

    public setSessionAttributes(sessionAttributes: {
        [key: string]: any;
    }) {
        this.sessionAttributes = sessionAttributes;
    }

    public savePersistentAttributes() {

    }
}

export class MyHandlerInput implements HandlerInput {

    requestEnvelope: RequestEnvelope;
    context?: any;
    attributesManager: any;
    responseBuilder: any;

    constructor(){
        this.attributesManager = new AttributesManager();
    }

}