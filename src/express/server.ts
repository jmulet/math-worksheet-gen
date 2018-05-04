// Minimal express server
import * as express from 'express';
import { wsMathMiddleware } from './wsMathMiddleware'; 
import * as methodOverride from 'method-override';

const app = express();
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());   
app.use(wsMathMiddleware());

app.get('/', function (req, res) {
    res.send('hello to ws math gen!')
})

app.listen(3100, function(err) {
    console.log("Listening to port 3100");   
})