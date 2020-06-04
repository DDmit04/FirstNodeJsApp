import cors from 'cors'
import path from "path"

const cookieParser = require('cookie-parser')
const passport = require('passport')
const session = require('express-session')
const bodyParser = require("body-parser")
require('./security/PassportConfig')

import express, {Application, Request, Response} from 'express'
import {logErrors, logEvents} from "./serverUtils/loggers"
import {errorHandler} from "./serverUtils/Handlers"
import {connectDatabase, sessionStore} from "./serverUtils/DatabaseConnect"
import {TaskController} from "./controllers/TaskController"
import {AbstractController} from "./controllers/AbstractController"
import {LoginController} from "./controllers/LoginController"
import {UserController} from "./controllers/UserController";


const DbConnection = connectDatabase()

const app: Application = express()

app.use(cors());

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
    next();
});

const mainController: AbstractController = new TaskController()
const loginController: AbstractController = new LoginController()
const userController: AbstractController = new UserController()

app.use(express.static(path.resolve("dist/")))
app.use(express.static('public'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());

app.use(session({
    maxAge: 60 * 60 * 1000,
    secret: 'keyboa12',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    path: '/*'
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(logEvents);
app.use(logErrors);
app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.resolve("build/", "index.html"))
})

app.use('/auth', loginController.routerMethods)
app.use('/user', userController.routerMethods)
app.use('/api', mainController.routerMethods)

app.get("*", (req: Request, res: Response, next: Function) => {
    res.redirect('/')
})

let PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`running on ${PORT}...`))
