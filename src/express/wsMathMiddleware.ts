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
        const seed = req.query.seed; 
         
        let body = req.body;
        if (!body) {
            body = generateSampleBody();
        }
        if (typeof (body) === 'string') {
            body = JSON.parse(body);
        }
        body.seed = seed;
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
                                { gen: "algebra/polynomial/division", repeat: 4, options: {ruffini: true} }
                            ]
                        },
                        {
                            formulation: "Dividide these polinomials", questions: [
                                { gen: "algebra/polynomial/division", repeat: 4, options: {fraction: false, maxDegree: 4, interval: 5} }
                            ]
                        },
                        {
                            formulation: "Expand these algebraic identities", questions: [
                                { gen: "algebra/polynomial/identities", repeat: 2, options: {interval: 5, complexity: 1}},
                                { gen: "algebra/polynomial/identities", repeat: 2, options: {interval: 5, complexity: 2}},
                                { gen: "algebra/polynomial/identities", repeat: 2, options: {interval: 5, complexity: 3}}
                            ]
                        },
                        {
                            formulation: "Write these polynomials as an algebraic identity", questions: [
                                { gen: "algebra/polynomial/identities", repeat: 2, options: {interval: 5, complexity: 1, indirect: true} },
                                { gen: "algebra/polynomial/identities", repeat: 2, options: {interval: 5, complexity: 3, indirect: true} }
                            ]
                        },
                        {
                            formulation: "Extract common factor from these polynomials", questions: [
                                { gen: "algebra/polynomial/commonfactor", repeat: 3, options: {interval: 5, complexity: 1} } 
                            ]
                        }
                    ]
                }
            ]
        }
    };


    return body;
}