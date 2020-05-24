import {
    INewTorrentRequest,
    ITransmissionFreeSpaceRequest,
    ITransmissionFreeSpaceResponse,
    ITransmissionRequest,
    ITransmissionResponse,
    ITransmissionTorrentAccessorRequest,
    ITransmissionTorrentAccessorResponse,
    ITransmissionTorrentActionsRequest,
    ITransmissionTorrentAddRequest,
    ITransmissionTorrentAddResponse,
    ITransmissionTorrentRemoveRequest,
    TransmissionOptions,
    TTorrentAccessorFields
} from "../types/Transmission";
import axios, {AxiosResponse} from 'axios';

const transmisionOptions: TransmissionOptions = {
    host: '192.168.0.254',
    port: 9091,
    username: 'transmission',
    password: 'torrent',
    ssl: false,
    url: 'transmission/rpc'
};

const minimumTorrentAttributes: TTorrentAccessorFields[] =
    ['id', 'name', 'rateDownload', "rateUpload", 'status', 'totalSize', 'eta', 'peersConnected', 'peersSendingToUs', 'downloadDir'];

export const mapTorrentToSimple = (torrents: any[]) => {
    return torrents.map(torrent => ({
        id: torrent.id,
        name: torrent.name,
        status: torrent.status,
        eta: torrent.eta,
        progress: torrent.percentDone,
        peers: torrent.peers.length,
        seeds: torrent.peersSendingToUs,
        savePath: torrent.downloadDir,
    }));
}

export class Transmission {
    private _requestUrl: string;
    private _sessionId: string;

    constructor(options: TransmissionOptions = transmisionOptions) {
        this._requestUrl = `http://${options.host}:${options.port}/${options.url}`;
        this._sessionId = '';
    }

    private createHeaders() {
        const token = Buffer.from(`${transmisionOptions.username}:${transmisionOptions.password}`).toString('base64');

        return {
            Authorization: `Basic ${token}`,
            'X-Transmission-Session-Id': this._sessionId
        }
    }

    private async prepareSessionId() {
        const headers = this.createHeaders();
        return await axios
            .post(this._requestUrl, {}, {headers})
            .catch(error => {
                if (error.response && error.response.status === 409) {
                    const {response} = error;
                    this._sessionId = response.headers['x-transmission-session-id']
                    console.log(`Session id set to: ${this._sessionId}`);
                }
            });
    }

    private async call<T extends ITransmissionResponse>(body: ITransmissionRequest) {
        if (!this._sessionId) {
            console.log('Preparing session id');
            await this.prepareSessionId();
        }
        const headers = this.createHeaders();

        return axios
            .post<any, AxiosResponse<T>>(
                this._requestUrl, body, {headers})
            .then(result => result.data);
    }

    public getTorrents(ids?: number[] | string[], extraAccessors?: TTorrentAccessorFields[]) {
        const fields: TTorrentAccessorFields[] = [...minimumTorrentAttributes];

        if (extraAccessors) fields.push(...extraAccessors);

        const body: ITransmissionTorrentAccessorRequest = {
            method: "torrent-get",
            arguments: {
                fields
            }
        }
        return this.call<ITransmissionTorrentAccessorResponse>(body);
    }

    public addTorrent(request: INewTorrentRequest) {
        const {autostart, downloadDir, magnet} = request;
        const body: ITransmissionTorrentAddRequest = {
            method: 'torrent-add',
            arguments: {
                filename: magnet,
                paused: !autostart,
                "download-dir": downloadDir,
            }
        }
        return this.call<ITransmissionTorrentAddResponse>(body);
    }

    public removeTorrent(ids: number[], trashLocalData: boolean) {
        const body: ITransmissionTorrentRemoveRequest = {
            method: 'torrent-remove',
            arguments: {
                ids,
                "delete-local-data": trashLocalData,
            }
        }

        return this.call<ITransmissionResponse>(body);
    }

    public getFreeSpace(path: string) {
        const body: ITransmissionFreeSpaceRequest = {
            method: 'free-space',
            arguments: {
                path
            }
        }
        return this.call<ITransmissionFreeSpaceResponse>(body);
    }

    public startTorrent(ids: number[]) {
        const body: ITransmissionTorrentActionsRequest = {
            method: 'torrent-start',
            arguments: {
                ids
            }
        }
        return this.call<ITransmissionResponse>(body);
    }

    public stopTorrent(ids: number[]) {
        const body: ITransmissionTorrentActionsRequest = {
            method: 'torrent-stop',
            arguments: {
                ids
            }
        }
        return this.call<ITransmissionResponse>(body);
    }
}
