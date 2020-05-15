import {UserService} from "../service/UserService";
import {AccountType, User, UserModel} from "../data/User"

const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const LocalStrategy = require('passport-local').Strategy
require('dotenv').config()

const userService: UserService = new UserService()

passport.use(new LocalStrategy(
    async function(username: string, password: string, done: Function) {
        let DBUser
        if(username.indexOf('@') == -1) {
            DBUser = await UserModel.findOne({username: username})
        } else {
            DBUser = await UserModel.findOne({email: username})
        }
        if (DBUser == null) {
            done(null, false, {message: "user not exists!"})
        } else {
            done(null, DBUser.getCoreData())
        }
    }
));

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLR_CLIENT_SECRET,
        scope: ['profile', 'email'],
        callbackURL: "/auth/login/google/callback"
    },
    async function (accessToken: string, refreshToken: string, profile: any, done: Function) {
        profile = profile._json
        let DBUser = await UserModel.findByAccountIdAndType(profile.sub, AccountType.GOOGLE)
        if (DBUser == null) {
            let newUser: User = await userService.createUserFromGoogle(profile)
            done(null, newUser.getCoreData())
        } else {
            let resultUser = new User(DBUser.id, DBUser.username, DBUser.pass, AccountType.GOOGLE, DBUser.picture, DBUser.email)
            done(null, resultUser.getCoreData())
        }
    }
))

passport.serializeUser(async function (user: User, done: Function) {
    if (user.id != null) {
        done(null, user.id);
    } else {
        done(null, false, {message: `No user: ${user} in DB or session!`})
    }
});

passport.deserializeUser(async function (id: string | number, done: Function) {
    let user = await UserModel.findOne({id: id}).populate('tasks', '-__v').exec()
    if (user != null) {
        done(null, user);
    } else {
        done(null, false, {message: `No user with id: ${id} in DB or session!`});
    }
});