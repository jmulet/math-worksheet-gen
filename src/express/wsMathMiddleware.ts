import * as express from "express";
import { WsMathGenerator, WsExportFormats } from "../worksheet/WsMathGenerator";
import { latexToPdf } from '../util/latexToPdf';

export interface wsMathMdwOptions {
    basePrefix: string;
}

export function wsMathMiddleware(options?: wsMathMdwOptions) {
    options = options || { basePrefix: '' };

    const router = express.Router();

    let url = (options.basePrefix || '') + '/wsmath/gen';

    router.get(url, function (req: express.Request, res: express.Response, next: express.NextFunction) {
        const seed = req.query.seed;
        const type = req.query.type || 'html';
        console.log(req.query.body);
        let body = JSON.parse(req.query.body);

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
                    outputStream.on('error', function(err: any) {
                        res.setHeader("Content-type", "text/plain;charset=utf-8");
                        res.send(err + "\n\n" + Array(80).join("-") + "\n\n" + tex);
                    });
                    outputStream.pipe(res);
                
            }
        }
        // next();
    });

    
    url = (options.basePrefix || '') + '/wsmath';
    router.get(url, function (req: express.Request, res: express.Response, next: express.NextFunction) {

        const textarea: string = JSON.stringify(generateSampleBody(), null, 2)
            .replace(/"/g, "\\\"").replace(/\n/g, "\\n");

        const uri = (options.basePrefix || '') + '/wsmath/gen';

        const html = `
        <!DOCTYPE html>
        <html>
        <head>
        <title>Math worksheet generator</title>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.9.0/dist/katex.min.css" crossorigin="anonymous">
        <style>
        </style>
        </head>
        <body>
        <h2><b>Generate Maths Worksheets</b></h2>
        <h4>Define the worksheet here</h4>
        <textarea style="width:99%;" rows="35">
        </textarea>
        <br/>
        <a href="${uri}" target="_blank">Generate PDF</a>
        <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
        <script>
            $(function(){
                $("textarea").val("${textarea}");
                $("a").on("click", function(evt) {
                    evt.preventDefault();
                    var bodyEncoded = encodeURIComponent($("textarea").val());
                    var seed = 0;
                    var type = "pdf";                
                    window.open(evt.currentTarget.href + '?seed='+seed+'&type='+type+'&body='+bodyEncoded, "_blank");
                });
            });
        </script>
        </body>
        </html>
        `;
        res.set("Content-type", "text/html");
        res.send(html);
    });

    return router;
}


function generateSampleBody() {
    var body = {

        worksheet: {
            includeKeys: true,
            sections: [
                {
                    name: "Vectors", activities: [
                        {
                            formulation: "Given the vectors $${vecU.toTeX(true)}$, $${vecV.toTeX(true)}$ and $${vecW.toTeX(true)}$",
                            scope: {
                                vecU: "Vector.random(rnd, 2, 'u', 10)",
                                vecV: "Vector.random(rnd, 2, 'v', 10)",
                                vecW: "Vector.random(rnd, 2, 'w', 10)"
                            },
                            questions: [
                                { gen: "geometry/vectors/scalar_product", repeat: 4, options: {} }
                            ]
                        }
                    ]
                },
                
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
                        },
                        {
                            formulation: "Factorize these polynomials", questions: [
                                { gen: "algebra/polynomial/factorize", repeat: 4, options: { interval: 5, complexity: 1, maxDegree: 4, allowFractions: true } }
                            ]
                        }
                    ]
                }
            ]
        }
    };


    return body;
}