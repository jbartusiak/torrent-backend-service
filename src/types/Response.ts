import {Response} from "express";

export interface TorrentAPIResponse {
    code: number;
    message: string;

    [param: string]: any;
}

export interface Wildcard {
    [param: string]: any;
}

export const OK = (res: Response, bodyExtra: Wildcard) => {
    res.statusCode=200;
    res.send({
        code: 200,
        message: 'OK',
        ...bodyExtra
    });
};

export const NotFound = (res: Response) => {
    res.statusCode=404;
    res.send({
        code: 404,
        message: 'Resource not found',
    });
}

export const BadRequest = (res: Response, message?: string) => {
    res.statusCode=400;
    res.send({
        code: 400,
        message: message || 'Bad Request'
    })
}
