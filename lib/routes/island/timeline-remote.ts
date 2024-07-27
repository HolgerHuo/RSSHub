import { Route } from '@/types';
import got from '@/utils/got';
import utils from './utils';
import { config } from '@/config';
import ConfigNotFoundError from '@/errors/types/config-not-found';

export const route: Route = {
    path: '/remote/:only_media?',
    categories: ['social-media'],
    example: '/island/remote/true',
    parameters: { only_media: 'whether only display media content, default to false, any value to true' },
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    name: 'Instance timeline (federated)',
    maintainers: ['hoilc'],
    handler,
    description: ``,
};

async function handler(ctx) {
    const site = "mast.dragon-fly.club";
    const only_media = ctx.req.param('only_media') ? 'true' : 'false';

    const url = `http://${site}/api/v1/timelines/public?remote=true&only_media=${only_media}`;

    const response = await got.get(url, { headers: utils.apiHeaders() });
    const list = response.data;

    return {
        title: `Federated Public${ctx.req.param('only_media') ? ' Media' : ''} Timeline on ${site}`,
        link: `https://${site}`,
        item: utils.parseStatuses(list),
    };
}
