import 'dotenv/config';
import Express from 'express';

import TorrentSearch from 'torrent-search-api';

import providersRouter from "./routes/providers";
import torrentsRouter from "./routes/torrents";
import cors from 'cors';
import {configureDefaultProviders, corsOptions, getConfigByKey} from "./utils";
import transmissionRouter from "./routes/transmission";
import healthRouter from "./routes/health";
import {chalkError, chalkLog} from "./logger";

const appName = getConfigByKey('APPLICATION_NAME');
const port = parseInt(getConfigByKey('APPLICATION_PORT'));
const defaultProviders = getConfigByKey('DEFAULT_ENABLED_PROVIDERS');

const app = Express();

chalkLog(`Starting ${appName} on port: ${port}`)

export {TorrentSearch as TorrentClient};
export * as Types from './types';

app.use(cors(corsOptions));
app.use(Express.json());
app.use(healthRouter);
app.use(providersRouter);
app.use(torrentsRouter);
app.use(transmissionRouter);

const server = app.listen(port);

server.on('request', (request, response) => {
    const start = new Date().getTime();
    chalkLog(`Incoming request ${request.method} ${request.url}`);
    response.on('finish', () => {
        response.statusCode === 200 || response.statusCode === 304 ?
            chalkLog(`[HTTP Status: ${response.statusCode}] Response to ${request.method} ${request.url} took ${new Date().getTime() - start}ms`) :
            chalkError(`[HTTP Status: ${response.statusCode}] Response to ${request.method} ${request.url} took ${new Date().getTime() - start}ms`)
    })
});

chalkLog(`Configuring default providers: ${defaultProviders}`);
configureDefaultProviders();
