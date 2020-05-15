import {arrayProp, getModelForClass, pre, prop} from "@typegoose/typegoose";
import {plugin} from "@hasezoey/typegoose";
import {ModelType} from "@typegoose/typegoose/lib/types";
import {Task} from "./Task";
import {Ref} from "@hasezoey/typegoose/lib/types";

const passportLocalMongoose = require('passport-local-mongoose');

export enum AccountType {
    COMMON,
    GOOGLE
}

export class UserDetail {

    @prop({required: true})
    id: number | string = 0
    @prop({required: true})
    username: string = "no name"
    @prop({required: true})
    accountType: AccountType = AccountType.COMMON
    @prop()
    picture?: string
    @prop()
    email?: string

    protected constructor(id: number | string, username: string, accountType: AccountType, picture?: string, email?: string) {
        this.id = id;
        this.username = username;
        this.accountType = accountType;
        this.picture = picture;
        this.email = email;
    }
}

@plugin(passportLocalMongoose)
export class User extends UserDetail {

    @prop({required: true})
    private password: string

    @arrayProp({ ref: 'Task' })
    public tasks: Ref<Task>[];

    constructor(id: number | string, username: string, password: string, accountType: AccountType, picture?: string, email?: string) {
        super(id, username, accountType, picture, email)
        this.password = password
        this.tasks = []
    }

    public getCoreData(): UserDetail {
        return new UserDetail(this.id, this.username, this.accountType, this.picture, this.email)
    }

    static async findByAccountIdAndType(this: ModelType<User>, searchId: string | number, accountType: AccountType = AccountType.COMMON) {
        searchId = searchId.toString().concat(accountType.toString())
        let user = await this.findOne({id: searchId}, {__v: false})
        return user
    }

    static async findByAccountId(this: ModelType<User>, searchId: string | number) {
        let user = await this.findOne({id: searchId}, {__v: false})
        return user
    }

    get pass() {
        return this.password
    }

    set pass(newPass: string) {
        this.password = newPass
    }
}

export const UserModel = getModelForClass(User)