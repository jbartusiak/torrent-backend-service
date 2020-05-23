import {Request, Router} from "express";
import {OK} from "../types/Response";
import {Transmission} from "../classes/Transmission";
import {
    INewTorrentRequest,
    ITransmissionFreeSpaceResponse,
    ITransmissionTorrentAddResponse
} from "../types/Transmission";

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

transmissionRouter.post('/transmission/space',
    (req: Request<{}, ITransmissionFreeSpaceResponse, { path: string }>, res) => {
    transmission
        .getFreeSpace(req.body.path)
        .then(response => {
            OK(res, {
                response: {
                    path: response.arguments.path,
                    free: `${Math.round(response.arguments["size-bytes"]/1073741824)} GB`
                }
            })
        })
});

export default transmissionRouter;
