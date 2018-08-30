// Minimal express server
import * as express from 'express'; 
import { wsMathMiddleware } from './express/wsMathMiddleware';
import * as session from 'express-session';
const languageMdw = require('./express/middlewares/languageMdw');

const connectMemCached: any = require('connect-memcached'); 
// Manually lauch
// /usr/local/opt/memcached/bin/memcached
const app = express();
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());    
app.use(languageMdw);
app.set('view engine', 'ejs');  

const MemCachedStore = connectMemCached(session);

const sessionStore = new MemCachedStore({
    hosts: ['127.0.0.1:11211'],
    secret: "ñkj3499m_!EF"
});

const PROD = process.platform!=="darwin"

app.set('trust proxy', true)
app.use(session({
    name: "pwCookie",
    secret: 'ñkj3499m_!EF',
    resave: false,
    saveUninitialized: true,
    proxy: true,
    cookie: {
        secure: PROD,
        maxAge: 86400000,
        httpOnly: false,
        sameSite: true
    },
    unset: 'destroy',
    store: sessionStore
}));

app.use(wsMathMiddleware({piworldUrl: "https://piworld.es"}));
 
app.listen(3100, function(err) {
    console.log("math-worksheet-gen:: Listening to port 3100");   
})