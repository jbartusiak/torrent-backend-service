import Express from 'express';
import TorrentSearch from 'torrent-search-api';
import providersRouter from "./routes/providers";
import torrentsRouter from "./routes/torrents";
import cors, {CorsOptions} from 'cors';

const port = process.env.PORT;
const app = Express();

const corsOptions:CorsOptions = {
    origin: new RegExp('.*')
}

export {TorrentSearch as TorrentClient};

app.use(cors(corsOptions));
app.use(Express.json());
app.use(providersRouter);
app.use(torrentsRouter);

app.listen(port);
