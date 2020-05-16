import {CorsOptions} from "cors";
import {TorrentClient} from "./index";

const defaultProviders = process.env.DEFAULT_ENABLED_PROVIDERS?.split(',');

export const corsOptions:CorsOptions = {
    origin: new RegExp('.*')
}

export const configureDefaultProviders = () => {
    defaultProviders?.forEach(provider => {
        TorrentClient.enableProvider(provider);
    });
    console.log('Provider configuration done!');
}
