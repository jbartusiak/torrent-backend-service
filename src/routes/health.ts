import { Response, Router } from "express";

const healthRouter = Router();

healthRouter.get('/health', (req, res: Response) => {
    res.statusCode = 200;
    res.send({
        status: "UP",
    })
});

export default healthRouter;
