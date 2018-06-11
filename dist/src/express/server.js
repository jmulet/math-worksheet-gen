"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Minimal express server
const express = require("express");
const wsMathMiddleware_1 = require("./wsMathMiddleware");
const helmet = require("helmet");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.set('view engine', 'ejs');
app.use(wsMathMiddleware_1.wsMathMiddleware());
app.listen(3100, function (err) {
    console.log("math-worksheet-gen:: Listening to port 3100");
});
//# sourceMappingURL=server.js.map