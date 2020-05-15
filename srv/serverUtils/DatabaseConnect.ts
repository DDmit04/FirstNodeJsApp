import mongoose from "mongoose";
import session from "express-session";
const MongoStore = require('connect-mongo')(session);
require('dotenv').config()

let DBUrl: string = process.env.DB_URL!

export function connectDatabase() {
    mongoose.connect(DBUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    let db = mongoose.connection
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log('connected to DB!')
    })
    return db
}

export const sessionStore = new MongoStore({
    url: process.env.DB_URL,
    autoRemove: 'native',
    ttl: 14 * 24 * 60 * 60
})