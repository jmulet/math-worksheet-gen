import * as express from 'express'; 
import { MysqlStorage } from './repository/MsqlStorage';
import { Storage } from './repository/Storage'; 
import { downloadRoute } from './routes/downloadRoute';
import { homeRoute } from './routes/homeRoute';
import { editorRoute } from './routes/editorRoute';
import { dynImgRoute } from './routes/dynImgRoute';
 
export interface wsMathMdwOptions {
    basePrefix?: string;
    storage?: Storage;
    piworldUrl?: string;
}
  
export function wsMathMiddleware(options?: wsMathMdwOptions) {
    options = <wsMathMdwOptions> { basePrefix: '/wsmath', piworldUrl: 'https://piworld.es', ...options };
    if (!options.storage) {
        options.storage = new MysqlStorage();
    }
 

    const router = express.Router();

    // Attach routes
    downloadRoute(router, options);
    homeRoute(router, options);
    editorRoute(router, options);
    dynImgRoute(router, options);

    return router;
}



