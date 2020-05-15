import {AccountType, User, UserModel} from "../data/User"

require('dotenv').config()
const bcrypt = require("bcrypt")
const shortid = require('shortid');

const salt = bcrypt.genSaltSync(+process.env.SALT_VALUE!)

export class UserService {


    public async createUserFromGoogle(profile: any): Promise<User> {
        let password = await bcrypt.hashSync(Math.random().toString(36).slice(-8).toString(), salt)
        let userIdWithAccountType = profile.sub.toString().concat(AccountType.GOOGLE.toString())
        let newUser: User = await new User(userIdWithAccountType, profile.given_name, password, AccountType.GOOGLE, profile.picture, profile.email)
        let DBUser: User = await UserModel.create(newUser)
        // bcrypt.compare(passToCheck, DBPassword, function (err: Error, result: string) {
        //     if (err) {
        //         throw (err);
        //     }
        //     console.log(result);
        // });
        return DBUser
    }

    public async createUser(username: string, password: string, email: string): Promise<User> {
        let DBUser: User
        let userIdWithAccountType = shortid.generate().toString().concat(AccountType.COMMON.toString())
        password = await bcrypt.hashSync(password, salt)
        // bcrypt.compare(passToCheck, DBPassword, function (err: Error, result: string) {
        //     if (err) {
        //         throw (err);
        //     }
        //     console.log(result);
        // });
        let newUser: User = new User(userIdWithAccountType, username, password, AccountType.COMMON, "", email)
        DBUser = await UserModel.create(newUser)
        return DBUser
    }

}