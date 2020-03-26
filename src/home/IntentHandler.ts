import {
    DialogflowConversation
} from 'actions-on-google'
import { Plateform } from 'SkillActionLib';


export const configureHandler = (app) => {
    app.intent('WelcomeIntent', async (conv: DialogflowConversation) => {
        new Plateform(conv).template.simpleMessage('Bienvenue', null, false);
        return Promise.resolve();
    });
}
