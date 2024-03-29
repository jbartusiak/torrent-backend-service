import {CorsOptions} from "cors";
import {TorrentClient} from "./index";
import {chalkLog} from "./logger";

const defaultProviders = process.env.DEFAULT_ENABLED_PROVIDERS?.split(',');

export const corsOptions:CorsOptions = {
    origin: new RegExp('.*')
}

export const configureDefaultProviders = () => {
    defaultProviders?.forEach(provider => {
        TorrentClient.enableProvider(provider);
    });
    chalkLog('Provider configuration done!');
}

export const getConfigByKey = (key: string): string => {
    return process.env[key] || '';
}
