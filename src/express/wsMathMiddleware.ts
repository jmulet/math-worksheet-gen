import * as express from "express";
import { WsMathGenerator, WsExportFormats } from "../worksheet/WsMathGenerator";

export interface wsMathMdwOptions {
    basePrefix: string;
}

export function wsMathMiddleware(options?: wsMathMdwOptions) {
    options = options || { basePrefix: '' };

    const router = express.Router();

    const url = (options.basePrefix || '') + '/wsmath';

    router.get(url, function (req: express.Request, res: express.Response, next: express.NextFunction) {
        let body = req.body;
        if (!body) {
            body = generateSampleBody();
        }
        if (typeof (body) === 'string') {
            body = JSON.parse(body);
        }
        const generator = new WsMathGenerator(body);
        const html = generator.exportAs(WsExportFormats.HTML);
        res.setHeader("Content-Type", "text/html");
        res.status(200).send(html);
        next()
    });

    return router;
}


function generateSampleBody() {
    var body = {

        worksheet: {
            includeKeys: true,
            sections: [
                {
                    name: "Polynomials", activities: [
                        {
                            formulation: "Dividide these polinomials using Ruffini's rule", questions: [
                                { gen: "Algebra/PolyDivision", repeat: 4, options: {ruffini: true} }
                            ]
                        },
                        {
                            formulation: "Dividide these polinomials", questions: [
                                { gen: "Algebra/PolyDivision", repeat: 4, options: {fraction: false, maxDegree: 4} }
                            ]
                        }
                    ]
                }
            ]
        }
    };


    return body;
}