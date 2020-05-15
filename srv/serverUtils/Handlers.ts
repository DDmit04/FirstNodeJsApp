import {Request, Response} from "express";

function errorHandler(err: Error, req: Request, res: Response, next: Function) {
    if (req.xhr) {
        res.status(500).send({ error: 'Server error!' });
    }
}

export {
    errorHandler
}