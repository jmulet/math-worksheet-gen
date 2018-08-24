import * as express from 'express'; 
import { MysqlStorage } from './repository/MsqlStorage';
import { Storage } from './repository/Storage'; 
import { downloadRoute } from './routes/downloadRoute';
import { homeRoute } from './routes/homeRoute';
import { editorRoute } from './routes/editorRoute';
 
export interface wsMathMdwOptions {
    basePrefix?: string;
    storage?: Storage;
    piworldUrl?: string;
}
 
//Mysql - Cache is cleared after 5 minutes
const deltaTime = 5 * 60 * 1000;

export function wsMathMiddleware(options?: wsMathMdwOptions) {
    options = <wsMathMdwOptions> { basePrefix: '/wsmath', piworldUrl: 'https://piworld.es', ...options };
    if (!options.storage) {
        options.storage = new MysqlStorage();
    }

    setInterval(function () {
        options.storage.clear();
    }, deltaTime);

    const router = express.Router();

    // Attach routes
    downloadRoute(router, options);
    homeRoute(router, options);
    editorRoute(router, options);

    return router;
}



