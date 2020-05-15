const { body, validationResult, query } = require('express-validator')
import {Request, Response, NextFunction} from 'express';

const taskAddValidate = () => {
    return [
        body('taskText').notEmpty().withMessage("Task text is required!"),
        body('taskType').notEmpty().withMessage("Task type is required!")
    ]
}

const taskDeleteValidate = () => {
    return [
        query('id').notEmpty().withMessage("Task ID is required!"),
    ]
}

const taskActionValidate = () => {
    return [
        body('id').notEmpty().withMessage("Task ID is required!"),
        body('newTaskType').notEmpty().withMessage("Task type is required!")
    ]
}

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    return res.status(400).json({
        errors: errors.array(),
        reason: "bad request (unknown TaskType)"
    })
}

export {
    taskAddValidate,
    taskActionValidate,
    taskDeleteValidate,
    validateRequest,
}