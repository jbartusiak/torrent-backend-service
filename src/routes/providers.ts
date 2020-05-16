import {Request, Response, Router} from 'express';
import {TorrentClient} from "../index";
import {NotFound, OK, TorrentAPIResponse} from "../types/Response";

interface EnableProvidersRequest {
    [name: string]: boolean
}

const allProviders = TorrentClient.getProviders();
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
        NotFound(res);

    Object.entries(req.body).forEach((entry) => {
        const [providerName, enabled] = entry;
        if (enabled) TorrentClient.enableProvider(providerName);
        else TorrentClient.disableProvider(providerName);
    });
    res.status(200);
    res.send({
        message: 'Providers enabled successfully',
        enabledProviders: [
            ...TorrentClient.getActiveProviders().map(el => el.name)
        ]
    })
});

export default providersRouter;
