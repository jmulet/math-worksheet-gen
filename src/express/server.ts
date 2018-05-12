// Minimal express server
import * as express from 'express';
import { wsMathMiddleware } from './wsMathMiddleware'; 
import * as methodOverride from 'method-override';
import * as helmet from 'helmet';
import { MysqlStorage } from './MsqlStorage';
import * as ejs from 'ejs';

const app = express();
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());   
app.use(helmet());
app.set('view engine', 'ejs');  
app.use(wsMathMiddleware());

app.listen(3100, function(err) {
    console.log("math-worksheet-gen:: Listening to port 3100");   
})