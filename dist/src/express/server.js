"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Minimal express server
const express = require("express");
const wsMathMiddleware_1 = require("./wsMathMiddleware");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(wsMathMiddleware_1.wsMathMiddleware());
app.get('/', function (req, res) {
    res.send('hello to ws math gen!');
});
app.listen(3100, function (err) {
    console.log("Listening to port 3100");
});
//# sourceMappingURL=server.js.map