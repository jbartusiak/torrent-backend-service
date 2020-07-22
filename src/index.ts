import 'dotenv/config';
import Express from 'express';

import TorrentSearch from 'torrent-search-api';

import providersRouter from "./routes/providers";
import torrentsRouter from "./routes/torrents";
import cors from 'cors';
import { configureDefaultProviders, corsOptions, getConfigByKey } from "./utils";
import transmissionRouter from "./routes/transmission";
import healthRouter from "./routes/health";

const appName = getConfigByKey('APPLICATION_NAME');
const port = parseInt(getConfigByKey('APPLICATION_PORT'));
const defaultProviders = getConfigByKey('DEFAULT_ENABLED_PROVIDERS');

const app = Express();

console.log(`Starting ${ appName } on port: ${ port }`)

export { TorrentSearch as TorrentClient };
export * as Types from './types';

app.use(cors(corsOptions));
app.use(Express.json());
app.use(healthRouter);
app.use(providersRouter);
app.use(torrentsRouter);
app.use(transmissionRouter);

app.listen(port);

console.log(`Configuring default providers: ${ defaultProviders }`);
configureDefaultProviders();
