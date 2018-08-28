"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const MsqlStorage_1 = require("./repository/MsqlStorage");
const downloadRoute_1 = require("./routes/downloadRoute");
const homeRoute_1 = require("./routes/homeRoute");
const editorRoute_1 = require("./routes/editorRoute");
function wsMathMiddleware(options) {
    options = Object.assign({ basePrefix: '/wsmath', piworldUrl: 'https://piworld.es' }, options);
    if (!options.storage) {
        options.storage = new MsqlStorage_1.MysqlStorage();
    }
    const router = express.Router();
    // Attach routes
    downloadRoute_1.downloadRoute(router, options);
    homeRoute_1.homeRoute(router, options);
    editorRoute_1.editorRoute(router, options);
    return router;
}
exports.wsMathMiddleware = wsMathMiddleware;
//# sourceMappingURL=wsMathMiddleware.js.map