// Minimal express server
import * as express from 'express';
import * as helmet from 'helmet';
import { wsMathMiddleware } from './wsMathMiddleware';
import * as session from 'express-session';
const connectMemCached: any = require('connect-memcached');
const cors =require('cors');
// Manually lauch
// /usr/local/opt/memcached/bin/memcached
const app = express();
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());   
//app.use(helmet());
//app.use(cors());
// Enable CORS
/*
var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
};
app.use(allowCrossDomain);
*/
app.set('view engine', 'ejs');  

const MemCachedStore = connectMemCached(session);
const store = new MemCachedStore({
    hosts: ['127.0.0.1:11211'],
    secret: "ñkj3499m_!EF"
});

app.use(session({
    name: "pwCookie",
    secret: 'ñkj3499m_!EF',
    store: store
}));
 

app.use(wsMathMiddleware({piworldUrl: "http://localhost:3000"}));
 
app.listen(3100, function(err) {
    console.log("math-worksheet-gen:: Listening to port 3100");   
})