import {Request, Router} from 'express';
import {TorrentClient} from "../index";
import {BadRequest, NotFound, OK, TorrentAPIResponse} from "../types/Response";
import {Torrent} from "torrent-search-api";

const torrentRouter = Router();

interface TorrentSearchQuery {
    categories?: string[],
    limit?: number,
    query: string,
}

torrentRouter.post(
    '/torrent/search',
    async (req: Request<{}, TorrentAPIResponse, TorrentSearchQuery>, res) => {
        if (!TorrentClient.getActiveProviders().length) {
            BadRequest(res, 'No providers are enabled!');
        }

        const {categories, query, limit} = req.body;
        const defaultCategory = 'All';

        if (!categories) {
            const defaultLimit = 20;
            const torrents = await TorrentClient.search(query, defaultCategory, limit || defaultLimit);
            torrents.length ? OK(res, {results: torrents}) : NotFound(res);
        }
        else {
            const defaultLimit = 5;
            const torrents: Torrent[] = [];
            for (const category of categories) {
                const categoryTorrent = await TorrentClient.search(query, category, limit || defaultLimit);
                torrents.push(...categoryTorrent);
            }
            torrents.length ? OK(res, {results: torrents}) : NotFound(res);
        }
    }
);

torrentRouter.post(
    '/torrent/details',
    async (req: Request<{}, TorrentAPIResponse, Torrent>, res) => {
        const torrent = req.body;

        const torrentHtml = await TorrentClient.getTorrentDetails(torrent);

        torrentHtml ? OK(res, {rawHTML: torrentHtml}) : NotFound(res);
    });

torrentRouter.post(
    '/torrent/magnet',
    async (req: Request<{}, TorrentAPIResponse, Torrent>, res) => {
        const torrent = req.body;
        const magnet = await TorrentClient.getMagnet(torrent);

        magnet ? OK(res, {magnet}) : NotFound(res);
    })

export default torrentRouter;
