import {
    dialogflow
} from 'actions-on-google'
import { configureHandler } from './IntentHandler';


// Create an app instance
const app = dialogflow({debug:true})
configureHandler(app);

exports.handler = app;