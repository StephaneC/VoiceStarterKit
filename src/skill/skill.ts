import { SkillBuilders } from 'ask-sdk';
import { RequestEnvelope, ResponseEnvelope } from 'ask-sdk-model';
import { IntentHandler } from './IntentHandler';
import { CustomRequestHandler } from './RequestHandler';
import { TouchEventHandler } from './TouchEventHandler';
import { AudioHandler } from './AudioHandler';
import { SkillEventHandler } from './SkillEventHandler';
import {
    LastResponseSavingResponseInterceptor, PersistenceSavingResponseInterceptor
} from 'SkillActionLib';
export async function handler(event: RequestEnvelope, context: any, callback: any): Promise<void> {

    const factory = SkillBuilders.standard()
        .addRequestHandlers(
            new TouchEventHandler(),
            new SkillEventHandler(),
            CustomRequestHandler.builder()
                .withHandlers(IntentHandler)
                .withHandlers(AudioHandler)
                .build()
        )//.addErrorHandlers(CustomErrorHandler)
        .addResponseInterceptors(LastResponseSavingResponseInterceptor, PersistenceSavingResponseInterceptor)
        .withAutoCreateTable(true)
        .withTableName(process.env.USER_SKILL_DB);


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