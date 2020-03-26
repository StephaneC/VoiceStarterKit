'use strict';

import { HandlerInput, RequestHandler } from 'ask-sdk';
import { IntentRequest, Response } from 'ask-sdk-model';
import { IHandler } from './IHandler';

export class CustomRequestHandler implements RequestHandler {
    public static builder() : CustomRequestHandlerBuilder {
        return new CustomRequestHandlerBuilder();
    }

    protected handlers : IHandler;

    constructor(builder : CustomRequestHandlerBuilder) {
        this.handlers = builder.handlers;
    }

    public async canHandle(handlerInput : HandlerInput) : Promise<boolean> {
        const targetHandlerName = (handlerInput.requestEnvelope.request.type === 'IntentRequest')
            ? (<IntentRequest> handlerInput.requestEnvelope.request).intent.name
            : handlerInput.requestEnvelope.request.type;

        return Object.prototype.hasOwnProperty.call(this.handlers, targetHandlerName);
    }

    public handle(handlerInput : HandlerInput) : Promise<Response> {
        const targetHandlerName = (handlerInput.requestEnvelope.request.type === 'IntentRequest')
            ? (<IntentRequest> handlerInput.requestEnvelope.request).intent.name
            : handlerInput.requestEnvelope.request.type;

        return this.handlers[targetHandlerName](handlerInput);
    }

}

export class CustomRequestHandlerBuilder {
    protected _handlers : IHandler;

    constructor() {
        this._handlers = {};
    }

    public get handlers() : IHandler {
        return this._handlers;
    }

    public withHandlers(handlers : IHandler) : this {
        this._handlers = {...this._handlers, ...handlers};

        return this;
    }

    public build() : CustomRequestHandler {
        return new CustomRequestHandler(this);
    }
}