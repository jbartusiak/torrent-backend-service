import {Router} from "express";
import {OK} from "../types/Response";
import {Transmission} from "../classes/Transmission";

const transmissionRouter = Router();
const transmission = new Transmission();

transmissionRouter.get('/transmission/active', (req, res) => {
    transmission
        .getTorrents()
        .then(response => {
            OK((res), {torrents: response.arguments.torrents})
        })
        .catch(err=> {console.error(err.message)
        res.send(err.message)})
});


export default transmissionRouter;
