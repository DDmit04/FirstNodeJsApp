import {Request, Response} from "express";

function logEvents(req: Request, res: Response, next: Function) {
    console.log(`[${Date().toString()}] ${req.hostname}${req.url}/${req.method}  IP: ${req.ip}  ${Object.keys(req.query).length != 0 ? 'QUERY: ' + JSON.stringify(req.query) : ''}  ${Object.keys(req.body).length != 0 ? 'BODY: ' + JSON.stringify(req.body) : ''}`)
    next();
}

function logErrors(err: Error, req: Request, res: Response, next: Function) {
    console.error(err.stack);
    next(err);
}

export {
    logEvents,
    logErrors
}