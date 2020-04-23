const { body, validationResult, query } = require('express-validator')
import {Request, Response, NextFunction} from 'express';

const taskAddValidate = () => {
    return [
        body('taskText').notEmpty(),
        body('taskType').notEmpty()
    ]
}

const taskActionValidate = () => {
    return [query('id').notEmpty()]
}

const taskFetchValidate = () => {
    return [query('taskType').notEmpty()]
}

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    return res.status(403).json({
        reason: "bad request (unknown TaskType)"
    })
}

export {
    taskAddValidate,
    taskFetchValidate,
    taskActionValidate,
    validateRequest,
}