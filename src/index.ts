require('dotenv').config();

import Express from 'express';
import TorrentSearch from 'torrent-search-api';
import providersRouter from "./routes/providers";
import torrentsRouter from "./routes/torrents";
import cors from 'cors';
import {corsOptions, configureDefaultProviders} from "./utils";

const port = process.env.APPLICATION_PORT;

const app = Express();

console.log(`Starting ${process.env.APPLICATION_NAME} on port: ${port}`)

export {TorrentSearch as TorrentClient};

app.use(cors(corsOptions));
app.use(Express.json());
app.use(providersRouter);
app.use(torrentsRouter);

app.listen(port);

console.log(`Configuring default providers: ${process.env.DEFAULT_ENABLED_PROVIDERS}`);
configureDefaultProviders();
