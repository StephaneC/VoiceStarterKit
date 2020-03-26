'use strict';

import { HandlerInput } from 'ask-sdk';
import { interfaces, Response } from 'ask-sdk-model';

import { IHandler } from './IHandler';
import { getCurrentPodcastId, getCurrentPodcastIndex, addCurrentPodcastIndex } from '../commons/storage';
import { podcastsBusiness } from '../commons/podcasts/podcasts.business';
import { parseEpisodeToken } from '../commons/podcasts/podcasts.utils';
import { playPodcast, podcastNearlyFinished, playbackFinished } from '../commons/Intent.player.business';
import * as template from '../commons/template';
import { Plateform } from 'SkillActionLib/dist';

const appId = process.env.RADIO;

export const AudioHandler: IHandler = {

    'AudioPlayer.PlaybackStarted': async function (input: HandlerInput): Promise<Response> {
        /*
         * AudioPlayer.PlaybackStarted Directive received.
         * Confirming that requested audio file began playing.
         * Do not send any specific response.
         */
        console.log("Playback started");
        return Promise.resolve(input.responseBuilder.getResponse());
    },
    'AudioPlayer.PlaybackFinished': async function (input: HandlerInput): Promise<Response> {
        console.log("Playback finished");
        /*
        * AudioPlayer.PlaybackFinished Directive received.
        * Confirming that audio file completed playing.
        * Do not send any specific response.
        */
        await playbackFinished(new Plateform(input));
        return Promise.resolve(input.responseBuilder.getResponse());
    },
    'AudioPlayer.PlaybackStopped': async function (input: HandlerInput): Promise<Response> {
        /*
         * AudioPlayer.PlaybackStopped Directive received.
         * Confirming that audio file stopped playing.
         */
        console.log("Playback stopped");

        //do not return a response, as per https://developer.amazon.com/docs/custom-skills/audioplayer-interface-reference.html#playbackstopped
        return Promise.resolve(input.responseBuilder.getResponse());
    },
    'AudioPlayer.PlaybackNearlyFinished': async function (input: HandlerInput): Promise<Response> {
        /*
         * AudioPlayer.PlaybackNearlyFinished Directive received.
         * Replacing queue with the URL again.
         * This should not happen on live streams
         */
        console.log("Playback nearly finished");
        const plateform = new Plateform(input);
        await podcastNearlyFinished(plateform);

        return Promise.resolve(input.responseBuilder.getResponse());

    },
    'AudioPlayer.PlaybackFailed': async function (input: HandlerInput): Promise<Response> {
        /*
         * AudioPlayer.PlaybackFailed Directive received.
         * Logging the error and restarting playing with no output speach
         */
        const plateform = new Plateform(input);
        const request = <interfaces.audioplayer.PlaybackFailedRequest>input.requestEnvelope.request;
        console.log("Playback Failed : " + JSON.stringify(request.error, null, 2));
        const token = plateform.inputUtils.getMediaToken();

        const podcastId = await getCurrentPodcastId(plateform);
        if (podcastId) {
            console.log(`play Next ${podcastId}`);
            const podcastIndex = await getCurrentPodcastIndex(plateform);
            await addCurrentPodcastIndex(plateform, podcastIndex + 1);
            await playPodcast(plateform, podcastId);
        } else {
            // replay podcast
            const parsed = parseEpisodeToken(token);
            template.playPodcast(plateform,
                {
                    url: parsed.url, broadcast_title: parsed.broadcast_title,
                    title: parsed.title, token: parsed.podcast_token, date: ''
                }, null)
        }
        return Promise.resolve(input.responseBuilder.getResponse());
    }
};