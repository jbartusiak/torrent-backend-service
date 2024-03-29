import {Request, Response, Router} from 'express';
import {TorrentClient} from "../index";
import {BadRequest, NotFound, OK, TorrentAPIResponse} from "../types/Response";

interface EnableProvidersRequest {
    [name: string]: boolean
}

const allProviders = TorrentClient.getProviders().filter(p => !p.requireAuthentification);
const providersRouter = Router();

const providerExists = (name: string) => !!allProviders.find(provider => provider.name === name);

providersRouter.get('/provider/:name', (req, res: Response<TorrentAPIResponse>) => {
    const providerName = req.params['name'];
    const provider = allProviders.find(provider => provider.name === providerName);
    if (provider) OK(res, {provider});
    else NotFound(res);
});

providersRouter.get('/providers', (req, res: Response<TorrentAPIResponse>) => {
    OK(res, {providers: [...allProviders]});
});

providersRouter.get('/provider/:name/categories', (req, res: Response<TorrentAPIResponse>) => {
    const providerName = req.params['name'];
    const provider = allProviders.find(provider => provider.name === providerName);
    if (provider)
        OK(res, {
            provider: providerName,
            categories: [...provider.categories]
        });
    else NotFound(res);
});

providersRouter.get('/providers/enabled', (req, res: Response<TorrentAPIResponse>) => {
    OK(res, {
        enabledProviders: [...TorrentClient.getActiveProviders()]
    });
});

providersRouter.post('/providers', (req: Request<{}, {}, EnableProvidersRequest>, res) => {
    if (!Object.keys(req.body).every(providerExists))
        BadRequest(res, 'One or more of providers in request is unknown');

    const errors: {[provider: string]: string} = {};

    Object.entries(req.body).forEach((entry) => {
        const [providerName, enabled] = entry;
        try {
            if (enabled) TorrentClient.enableProvider(providerName);
            else TorrentClient.disableProvider(providerName);
        }
        catch (error: any) {
            errors[providerName] = error.message;
        }
    });

    OK(res, {
        enabledProviders: [
            ...TorrentClient.getActiveProviders().map(el => el.name)
        ],
        errors
    })
});

export default providersRouter;
