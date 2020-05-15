import express, {Router} from "express";

export abstract class AbstractController {

    protected router: Router = express.Router()

    protected constructor() {
        this.initMethods()
    }

    protected abstract initMethods(): void

    get routerMethods(): Router {
        return this.router
    }
}