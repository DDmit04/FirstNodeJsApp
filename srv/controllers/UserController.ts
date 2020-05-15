import {AbstractController} from "./AbstractController";
import {Request, Response} from "express";
import {User, UserModel} from "../data/User";
import {UserService} from "../service/UserService";
import {validateRequest} from "../validation/TaskValidator";
import {userCreateValidate, userEmailCheck, usernameCheck} from "../validation/UserValidator";

const userService: UserService = new UserService()

export class UserController extends AbstractController {

    constructor() {
        super();
    }

    protected initMethods(): void {
        this.router.get('/', this.getCurrentUser)
        this.router.get('/check/username', usernameCheck(), validateRequest, this.checkUsername)
        this.router.get('/check/email', userEmailCheck(), validateRequest, this.checkEmail)
        this.router.post('/register', userCreateValidate(), validateRequest, this.createUser)
    }

    private async checkUsername(req: Request, res: Response) {
        let userByUsername = await UserModel.find({username: req.query.username as string}).exec()
        if(userByUsername.length > 0) {
            res.json({userExists: true})
        } else {
            res.json({userExists: false})
        }
    }

    private async checkEmail(req: Request, res: Response) {
        let userByUsername = await UserModel.find({email: req.query.email as string}).exec()
        if(userByUsername.length > 0) {
            res.json({userExists: true})
        } else {
            res.json({userExists: false})
        }
    }

    private async createUser(req: Request, res: Response) {
        if (req.body.password === req.body.passwordConf) {
            await userService.createUser(req.body.username, req.body.password, req.body.email)
            res.json({})
        } else {
            res.status(403).json("Password is not confirmed!")
        }
    }

    private getCurrentUser(req: Request, res: Response) {
        let user
        if (req.user != null) {
            user = req.user as User
            res.json(user.getCoreData())
        } else {
            res.json(null)
        }
    }
}