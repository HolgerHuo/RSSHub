import { Route } from '@/types';
import got from '@/utils/got';
import utils from './utils';
import { config } from '@/config';
import ConfigNotFoundError from '@/errors/types/config-not-found';

export const route: Route = {
    path: '/timeline/:only_media?',
    categories: ['social-media'],
    example: '/island/timeline/true',
    parameters: { only_media: 'whether only display media content, default to false, any value to true' },
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    name: 'Instance timeline (local)',
    maintainers: ['hoilc'],
    handler,
    description: ``,
};

async function handler(ctx) {
    const site = "mast.dragon-fly.club";
    const only_media = ctx.req.param('only_media') ? 'true' : 'false';
    
    const url = `http://${site}/api/v1/timelines/public?local=true&only_media=${only_media}`;

    const response = await got.get(url, { headers: utils.apiHeaders() });
    const list = response.data;

    return {
        title: `Local Public${ctx.req.param('only_media') ? ' Media' : ''} Timeline on ${site}`,
        link: `https://${site}`,
        item: utils.parseStatuses(list),
    };
}
