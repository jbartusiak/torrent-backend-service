export interface Transmission {
    id: number;
    name: string;

    status: number;
    statusLabel: string;

    progress: number;
    seeds: number;
    peers: number;
    eta: number;

    savePath: string;
}

export interface INewTorrentRequest {
    magnet: string;
    autostart: boolean;
    downloadDir: string;
}

export interface TransmissionOptions {
    host: string;
    port: number;
    username: string;
    password: string;
    ssl: boolean;
    url: string;
}

export interface ITransmissionRequest {
    method: string;
    arguments?: {
        [key: string]: any;
    };
    tag?: string;
}

export interface ITransmissionResponse {
    result: string;
    arguments: {
        [key: string]: any;
    }
    tag?: string;
}

export type TTorrentAccessorFields = 'activityDate' | 'addedDate' | 'bandwidthPriority' | 'comment' | 'corruptEver' | 'creator' | 'dateCreated' | 'desiredAvailable' | 'doneDate' | 'downloadDir' | 'downloadedEver' | 'downloadLimit' | 'downloadLimited' | 'editDate' | 'error' | 'errorString' | 'eta' | 'etaIdle' | 'files' | 'fileStats' | 'hashString' | 'haveUnchecked' | 'haveValid' | 'honorsSessionLimits' | 'id' | 'isFinished' | 'isPrivate' | 'isStalled' | 'labels' | 'leftUntilDone' | 'magnetLink' | 'manualAnnounceTime' | 'maxConnectedPeers' | 'metadataPercentComplete' | 'name' | 'peer-limit' | 'peers' | 'peersConnected' | 'peersFrom' | 'peersGettingFromUs' | 'peersSendingToUs' | 'percentDone' | 'pieces' | 'pieceCount' | 'pieceSize' | 'priorities' | 'queuePosition' | 'rateDownload (B/s)' | 'rateUpload (B/s)' | 'recheckProgress' | 'secondsDownloading' | 'secondsSeeding' | 'seedIdleLimit' | 'seedIdleMode' | 'seedRatioLimit' | 'seedRatioMode' | 'sizeWhenDone' | 'startDate' | 'status' | 'trackers' | 'trackerStats' | 'totalSize' | 'torrentFile' | 'uploadedEver' | 'uploadLimit' | 'uploadLimited' | 'uploadRatio' | 'wanted' | 'webseeds' | 'webseedsSendingToUs';
export type TTorrentAccessorFile = 'bytesCompleted' | 'length' | 'name';

export interface ITransmissionTorrentAccessorRequest extends ITransmissionRequest {
    method: 'torrent-get',
    arguments: {
        fields: TTorrentAccessorFields[];
        format?: 'torrents' | 'table';
        ids?: number | number[];
    }
}

export interface ITransmissionTorrentAccessorResponse extends ITransmissionResponse {
    arguments: {
        torrents: [{}];
    }
}

export interface ITransmissionTorrentAddRequest extends ITransmissionRequest{
    method: 'torrent-add',
    arguments: {
        cookies?: string;
        'download-dir'?: string;
        filename: string;
        metainfo?: string;
        paused?: boolean;
        'peer-limit'?: number;
        bandwidthPriority?: number;
        'files-wanted'?: [];
        'files-unwanted'?: [];
        'priorities-high'?: [];
        'priorities-medium'?: [];
        'priorities-low'?: [];
    }
}

export interface ITransmissionTorrentAddResponse extends ITransmissionResponse {
    arguments: {
        'torrent-added'?: {
            id: number;
            name: string;
            hashString: string;
        }
        'torrent-duplicate'?: {
            id: number;
            name: string;
            hashString: string;
        }
    }
}

export interface ITransmissionFreeSpaceRequest extends ITransmissionRequest {
    method: 'free-space',
    arguments: {
        path: string;
    }
}

export interface ITransmissionFreeSpaceResponse extends ITransmissionResponse {
    arguments: {
        path: string;
        'size-bytes': number;
    }
}
