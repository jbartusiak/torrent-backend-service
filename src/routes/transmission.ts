import {Request, Router} from "express";
import {OK} from "../types/Response";
import {Transmission} from "../classes/Transmission";
import {INewTorrentRequest, ITransmissionTorrentAddResponse} from "../types/Transmission";

const transmissionRouter = Router();
const transmission = new Transmission();

transmissionRouter.get('/transmission/active', (req, res) => {
    transmission
        .getTorrents()
        .then(response => {
            OK((res), {torrents: response.arguments.torrents})
        })
        .catch(err => {
            console.error(err.message)
            res.send(err.message)
        });
});

transmissionRouter.post('/transmission/new', (req: Request<{}, ITransmissionTorrentAddResponse, INewTorrentRequest>, res) => {
    transmission
        .addTorrent(req.body)
        .then(response => {
            OK(res, {response: response.arguments["torrent-added"] || response.arguments["torrent-duplicate"]})
        })
        .catch(err => {
            console.log(err.message);
            res.send(err.message);
        });
})

export default transmissionRouter;
