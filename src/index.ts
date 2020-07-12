import Express from 'express';

import TorrentSearch from 'torrent-search-api';

import providersRouter from "./routes/providers";
import torrentsRouter from "./routes/torrents";
import cors from 'cors';
import { configureDefaultProviders, corsOptions } from "./utils";
import transmissionRouter from "./routes/transmission";
import healthRouter from "./routes/health";

process.env.APPLICATION_NAME = 'torrent-backend-service';
process.env.APPLICATION_PORT = '3001';
process.env.DEFAULT_ENABLED_PROVIDERS = '1337x,KickassTorrents';

const port = parseInt(process.env.APPLICATION_PORT);

const app = Express();

console.log(`Starting ${ process.env.APPLICATION_NAME } on port: ${ port }`)

export { TorrentSearch as TorrentClient };
export * as Types from './types';

app.use(cors(corsOptions));
app.use(Express.json());
app.use(healthRouter);
app.use(providersRouter);
app.use(torrentsRouter);
app.use(transmissionRouter);

app.listen(port);

console.log(`Configuring default providers: ${ process.env.DEFAULT_ENABLED_PROVIDERS }`);
configureDefaultProviders();
