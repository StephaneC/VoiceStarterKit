import { SkillBuilders } from 'ask-sdk';
import { RequestEnvelope, ResponseEnvelope } from 'ask-sdk-model';
import { IntentHandler } from './IntentHandler';
import { CustomRequestHandler } from './RequestHandler';
import { TouchEventHandler } from './TouchEventHandler';
import {
    LastResponseSavingResponseInterceptor, PersistenceSavingResponseInterceptor
} from 'SkillActionLib';
export async function handler(event: RequestEnvelope, context: any, callback: any): Promise<void> {

    const factory = SkillBuilders.standard()
        .addRequestHandlers(
            new TouchEventHandler(),
            CustomRequestHandler.builder()
                .withHandlers(IntentHandler)
                .build()
        )//.addErrorHandlers(CustomErrorHandler)
        .addResponseInterceptors(LastResponseSavingResponseInterceptor);


    const skill = factory.create();

    try {

        console.log(JSON.stringify(event, null, 2));

        const responseEnvelope: ResponseEnvelope = await skill.invoke(event, context);

        console.log(JSON.stringify(responseEnvelope, null, 2));

        return callback(null, responseEnvelope);

    } catch (error) {
        console.log(JSON.stringify(error, null, 2));
        return callback(error);
    }
}