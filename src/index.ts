import Express from 'express';
import TorrentSearch from 'torrent-search-api';
import providersRouter from "./routes/providers";

const port = process.env.PORT;
const app = Express();

export {TorrentSearch as TorrentClient};

app.use(Express.json());
app.use(providersRouter);

app.listen(port);
