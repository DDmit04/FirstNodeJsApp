import {query} from "express-validator";

const { body} = require('express-validator')

const userCreateValidate = () => {
    return [
        body('password').notEmpty().withMessage("password is required!"),
        body('passwordConf').notEmpty().withMessage("passwordConf is required!"),
        body('username').notEmpty().withMessage("Username is required!"),
        body('email')
            .notEmpty().withMessage("email is required!")
            .isEmail().withMessage("Email value isn't email!")
    ]
}

const usernameCheck = () => {
    return [
        query('username').notEmpty().withMessage("Username is required!"),
    ]
}

const userEmailCheck = () => {
    return [
        query('email')
            .notEmpty().withMessage("email is required!")
            .isEmail().withMessage("Email value isn't email!")
    ]
}

const userLoginValidate = () => {
    return [
        body('password').notEmpty().withMessage("password is required!"),
        body('username').notEmpty().withMessage("Username is required!"),
    ]
}

export {
    userCreateValidate,
    userLoginValidate,
    userEmailCheck,
    usernameCheck
}