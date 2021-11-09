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
    ITransmissionTorrentAddResponse, ITransmissionTorrentMutateRequest,
    ITransmissionTorrentRemoveRequest,
    TransmissionOptions,
    TTorrentAccessorFields
} from "../types/Transmission";
import axios, {AxiosResponse} from 'axios';
import {chalkLog} from "../logger";

const transmissionOptions: () => TransmissionOptions = () => {
    var options = {
        host: process.env.SERVER_HOST || 'localhost',
        port: Number.parseInt(process.env.SERVER_PORT || '9091') ,
        username: process.env.SERVER_USERNAME || 'transmission',
        password: process.env.SERVER_PASSWORD || 'torrent',
        ssl: false,
        url: 'transmission/rpc',
    };

    chalkLog('Initializing transmission class with following properties: ');
    Object.entries(options).forEach(([key, value]) => {
        chalkLog(`${key}: ${value}`);
    });

    return options;
};

const allTorrentAttributes: TTorrentAccessorFields[] =
    ['activityDate', 'addedDate', 'bandwidthPriority', 'comment', 'corruptEver', 'creator', 'dateCreated', 'desiredAvailable', 'doneDate', 'downloadDir', 'downloadedEver', 'downloadLimit', 'downloadLimited', 'editDate', 'error', 'errorString', 'eta', 'etaIdle', 'files', 'fileStats', 'hashString', 'haveUnchecked', 'haveValid', 'honorsSessionLimits', 'id', 'isFinished', 'isPrivate', 'isStalled', 'labels', 'leftUntilDone', 'magnetLink', 'manualAnnounceTime', 'maxConnectedPeers', 'metadataPercentComplete', 'name', 'peer-limit', 'peers', 'peersConnected', 'peersFrom', 'peersGettingFromUs', 'peersSendingToUs', 'percentDone', 'pieceCount', 'pieceSize', 'priorities', 'queuePosition', 'rateDownload', 'rateUpload', 'recheckProgress', 'secondsDownloading', 'secondsSeeding', 'seedIdleLimit', 'seedIdleMode', 'seedRatioLimit', 'seedRatioMode', 'sizeWhenDone', 'startDate', 'status', 'totalSize', 'torrentFile', 'uploadedEver', 'uploadLimit', 'uploadLimited', 'uploadRatio', 'wanted', 'webseeds', 'webseedsSendingToUs'];

const minimumTorrentAttributes: TTorrentAccessorFields[] =
    ['id', 'name', 'rateDownload', "rateUpload", 'status', 'totalSize', 'eta', 'labels', 'peersConnected', 'peersSendingToUs', 'downloadDir', 'percentDone', 'downloadedEver'];

export class Transmission {
    private _requestUrl: string;
    private _sessionId: string;

    constructor(private options: TransmissionOptions = transmissionOptions()) {
        this._requestUrl = `http://${options.host}:${options.port}/${options.url}`;
        this._sessionId = '';
    }

    private createHeaders() {
        const token = Buffer.from(`${this.options.username}:${this.options.password}`).toString('base64');

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
                    chalkLog(`Session id set to: ${this._sessionId}`);
                }
            });
    }

    private async call<T extends ITransmissionResponse>(body: ITransmissionRequest) {
        await this.prepareSessionId();
        const headers = this.createHeaders();

        chalkLog(`Calling transmission on ${this._requestUrl} with body: ${JSON.stringify(body)} and headers: ${JSON.stringify(headers)}`);

        return axios
            .post<any, AxiosResponse<T>>(
                this._requestUrl, body, {headers})
            .then(result => result.data);
    }

    public getAllTorrents(id: number) {
        const body: ITransmissionTorrentAccessorRequest = {
            method: 'torrent-get',
            arguments: {
                ids: id,
                fields: allTorrentAttributes
            }
        }
        return this.call<ITransmissionTorrentAccessorResponse>(body);
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

    public changeTorrent(args: { [key: string]: any }) {
        const body: ITransmissionTorrentMutateRequest = {
            method: 'torrent-set',
            arguments: {...args},
        };

        return this.call<ITransmissionResponse>(body);
    }
}
