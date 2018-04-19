import * as express from "express";
import { WsMathGenerator, WsExportFormats } from "../worksheet/WsMathGenerator";
import { latexToPdf } from '../util/latexToPdf';

export interface wsMathMdwOptions {
    basePrefix: string;
}

export function wsMathMiddleware(options?: wsMathMdwOptions) {
    options = options || { basePrefix: '' };

    const router = express.Router();

    const url = (options.basePrefix || '') + '/wsmath';

    router.get(url, function (req: express.Request, res: express.Response, next: express.NextFunction) {
        const seed = req.query.seed;
        const type = req.query.type || 'html';

        let body = req.body;
        if (!body) {
            body = generateSampleBody();
        }
        if (typeof (body) === 'string') {
            body = JSON.parse(body);
        }
        body.seed = seed;
        const generator = new WsMathGenerator(body);
        if (type === 'html') {
            const html = generator.exportAs(WsExportFormats.HTML);
            res.setHeader("Content-Type", "text/html");
            res.status(200).send(html);
        } else if (type === 'tex' || type === 'pdf') {
            const tex = generator.exportAs(WsExportFormats.LATEX);
            if (type === 'tex') {
                res.setHeader("Content-type", "text/plain;charset=utf-8");
                res.status(200).send(tex);
            } else {
                res.setHeader("Content-type", "application/pdf");
                const outputStream = latexToPdf(tex);
                outputStream.pipe(res);
            }
        }
        // next();
    });

    return router;
}


function generateSampleBody() {
    var body = {

        worksheet: {
            includeKeys: true,
            sections: [
                /*
                {
                    name: "Vectors", activities: [
                        {
                            formulation: "Given the vectors ${vecU.toTeX(true)}, ${vecV.toTeX(true)} and ${vecW.toTeX(true)}",
                            scope: {
                                vecU: "Vector.random(rnd, 2, 'u', 10)",
                                vecV: "Vector.random(rnd, 2, 'v', 10)",
                                vecW: "Vector.random(rnd, 2, 'w', 10)"
                            },
                            questions: [
                                { gen: "geometry/vector/scalar_product", repeat: 1, options: {} }
                            ]
                        }
                    ]
                },
                */
                {
                    name: "Polynomials", activities: [
                        {
                            formulation: "Dividide these polinomials using Ruffini's rule", questions: [
                                { gen: "algebra/polynomial/division", repeat: 4, options: { ruffini: true } }
                            ]
                        },
                        {
                            formulation: "Dividide these polinomials", questions: [
                                { gen: "algebra/polynomial/division", repeat: 4, options: { fraction: false, maxDegree: 4, interval: 5 } }
                            ]
                        },
                        {
                            formulation: "Expand these algebraic identities", questions: [
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 1 } },
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 2 } },
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 3 } }
                            ]
                        },
                        {
                            formulation: "Write these polynomials as an algebraic identity", questions: [
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 1, indirect: true } },
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 3, indirect: true } }
                            ]
                        },
                        {
                            formulation: "Extract common factor from these polynomials", questions: [
                                { gen: "algebra/polynomial/commonfactor", repeat: 3, options: { interval: 5, complexity: 1 } }
                            ]
                        }
                    ]
                }
            ]
        }
    };


    return body;
}