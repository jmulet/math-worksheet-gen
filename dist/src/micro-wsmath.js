"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Minimal express server
const express = require("express");
const wsMathMiddleware_1 = require("./express/wsMathMiddleware");
const session = require("express-session");
const connectMemCached = require('connect-memcached');
// Manually lauch
// /usr/local/opt/memcached/bin/memcached
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
const MemCachedStore = connectMemCached(session);
const sessionStore = new MemCachedStore({
    hosts: ['127.0.0.1:11211'],
    secret: "ñkj3499m_!EF"
});
app.set('trust proxy', true);
app.use(session({
    name: "pwCookie",
    secret: 'ñkj3499m_!EF',
    resave: false,
    saveUninitialized: true,
    proxy: true,
    cookie: {
        secure: true,
        maxAge: 86400000,
        httpOnly: false,
        sameSite: true
    },
    unset: 'destroy',
    store: sessionStore
}));
app.use(wsMathMiddleware_1.wsMathMiddleware({ piworldUrl: "https://piworld.es" }));
app.listen(3100, function (err) {
    console.log("math-worksheet-gen:: Listening to port 3100");
});
//# sourceMappingURL=micro-wsmath.js.map