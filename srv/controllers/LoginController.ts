import {AbstractController} from "./AbstractController";
import passport from "passport";
import {Request, Response} from "express";
import {validateRequest} from "../validation/TaskValidator";
import {userLoginValidate} from "../validation/UserValidator";
import {User} from "../data/User";

export class LoginController extends AbstractController {

    constructor() {
        super();
    }

    protected initMethods(): void {
        this.router.post('/login', userLoginValidate(), validateRequest,
            passport.authenticate('local', { failureRedirect: '/auth/login/error' }), this.loginCommon)
        this.router.get('/login/error', this.failCommonLogin)
        this.router.get('/login/google', passport.authenticate('google'))
        this.router.get('/login/google/callback', passport.authenticate('google'), this.loginWithGoogleCallback)
        this.router.get('/logout', this.logout)
    }

    private loginCommon(req: Request, res: Response, next: Function) {
        res.json(req.user)
    }

    private loginWithGoogleCallback(req: Request, res: Response, next: Function) {
        res.redirect('/')
    }

    private failCommonLogin(req: Request, res: Response, next: Function) {
        res.status(401)
        res.json("Wrong username or password!")
    }

    private logout(req: Request, res: Response, next: Function) {
        if (req.session) {
            req.session.destroy((err) => {
                if (err) {
                    return next(err);
                } else {
                    return res.redirect('/');
                }
            })
        }
    }

}