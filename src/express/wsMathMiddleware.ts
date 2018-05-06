import * as express from "express";
import { WsMathGenerator, WsExportFormats } from "../worksheet/WsMathGenerator";
import { latexToPdf } from '../util/latexToPdf';
import { Stream } from "stream";

export interface wsMathMdwOptions {
    basePrefix: string;
}

const DOCUMENT_CACHE: any = {};
const deltaTime = 5*60*1000;
//Cache is cleared after 5 minutes
setInterval(function() {
    const now = new Date().getTime();
    for (let key in DOCUMENT_CACHE) {
        const doc = DOCUMENT_CACHE[key];
        if (now - doc.generated >= deltaTime) {
            delete DOCUMENT_CACHE[key];
        }
    }   
}, deltaTime);

export function wsMathMiddleware(options?: wsMathMdwOptions) {
    options = options || { basePrefix: '' };

    const router = express.Router();

    const base = (options.basePrefix || '') + '/wsmath';
    let url = base + '/gen';

    router.post(url, function (req: express.Request, res: express.Response, next: express.NextFunction) {
        const seed = req.query.seed;
        const type = req.query.type || 'html';
        let body = req.body; 

        if (!body) {
            body = generateSampleBody();
        }
        if (typeof (body) === 'string') {
            body = JSON.parse(body);
        }
        body.seed = (seed == 0? '': seed);
        const generator = new WsMathGenerator(body);
        const id = Math.random().toString(32).substring(2);
        res.setHeader("Content-Type", "application/json");

        if (type === 'html') {
            const html = generator.exportAs(WsExportFormats.HTML);
            DOCUMENT_CACHE[id] = {
                generated: new Date().getTime(),
                type: 'html',
                data: html
            };
            res.status(200).send({ link: base + '/get?id=' + id });

        } else if (type === 'tex' || type === 'latex' || type === 'pdf') {
            const tex = generator.exportAs(WsExportFormats.LATEX);
            if (type === 'tex' || type === 'latex') {
                DOCUMENT_CACHE[id] = {
                    generated: new Date().getTime(),
                    type: 'tex',
                    data: tex
                };
                res.status(200).send({ link: base + '/get?id=' + id });
            } else {
                const outputStream = latexToPdf(tex);
                DOCUMENT_CACHE[id] = {
                    generated: new Date().getTime(),
                    type: 'pdf',
                    data: outputStream
                };
                res.status(200).send({ link: base + '/get?id=' + id });
            }
        }
    });

    url = base + '/get';

    router.get(url, function (req: express.Request, res: express.Response, next: express.NextFunction) {
        const id = req.query.id; 
        let doc = DOCUMENT_CACHE[id];
        if (!doc) {
            const html = `
            <!DOCTYPE html>
            <html>
            <head>
            <title>Math worksheet generator</title>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
            </style>
            </head>
            <body>
            <h1>Link not found or expired</h1>
            </body>
            </html>
            `;
            res.setHeader("Content-type", "text/html");
            res.status(200).send(html);
        } else {
            switch(doc.type) {
                case 'html': 
                    res.setHeader("Content-type", "text/html");
                    res.status(200).send(doc.data);
                    break;
                case 'tex': 
                    res.setHeader("Content-type", "text/plain");
                    res.status(200).send(doc.data);
                    break;
                case 'pdf': 
                    res.setHeader("Content-type", "application/pdf");
                    const outputStream = <Stream> doc.data;
                    outputStream.pipe(res);
                    break;
            }
        }
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
        Seed <input id="seed" type="number" min="0"/>
        <br/>
        <button class="btn" data-type="latex">Generate LaTeX</button>
        <button class="btn" data-type="html">Generate HTML</button>
        <button class="btn" data-type="pdf">Generate PDF</button>
        <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
        <script>
            $(function(){
                $("textarea").val("${textarea}");
                $(".btn").on("click", function(evt) {
                    var target = evt.currentTarget;
                    var type = $(target).data("type") || 'pdf';
                    var bodyEncoded = $("textarea").val();
                    try {
                        bodyEncoded = JSON.parse(bodyEncoded);
                    } catch(Ex) {
                        console.log(Ex);
                        return;
                    }
                    var seed = $("#seed").val() || 0;
                    var contentType = "text/html";
                    var fileName = "";
                    if (type === 'text' || type === 'latex') {
                        contentType = "text/plain;charset=UTF-8";
                        fileName = "mathgen.tex";
                    } else if (type === 'pdf') {
                        contentType = "application/pdf";
                        fileName = "mathgen.pdf";
                    }
                    $.ajax({
                        method: 'POST',
                        data: bodyEncoded,
                        responseType: 'aplication/json',
                        url: '${url}/gen?seed='+seed+'&type='+type 
                    }).then(function(data){           
                        window.open( data.link, '_blank' )                        
                    });

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
                    name: "Radicals", activities: [
                        {
                            formulation: "Escriu les potències en forma d'arrel i viceversa",                           
                            questions: [
                                { gen: "arithmetics/radicals/notation", repeat: 6, options: {maxIndex: 5} }                                
                            ]
                        },
                        {
                            formulation: "Treu factors i simplifica els radicals si és possible",                           
                            questions: [
                                { gen: "arithmetics/radicals/simplify", repeat: 4, options: {maxIndex: 5} }                                
                            ]
                        },
                        {
                            formulation: "Opera els radicals",                           
                            questions: [
                                { gen: "arithmetics/radicals/operations", repeat: 4, options: {} },
                                { gen: "arithmetics/radicals/operations", repeat: 2, options: {algebraic: true} }
                            ]
                        },                        
                        {
                            formulation: "Simplifica els radicals",                           
                            questions: [
                                { gen: "arithmetics/radicals/gather", repeat: 2, options: {maxIndex: 2} },
                                { gen: "arithmetics/radicals/gather", repeat: 2, options: {domain: 'Q'} }
                            ]
                        },
                        {
                            formulation: "Racionalitza els radicals",                           
                            questions: [
                                { gen: "arithmetics/radicals/rationalize", repeat: 2, options: {} },
                                { gen: "arithmetics/radicals/rationalize", repeat: 2, options: {conjugate: true} }
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
                        },
                        {
                            formulation: "Simplify these algebraic fractions", questions: [
                                { gen: "algebra/fractions/simplify", repeat: 4, options: { interval: 5, maxDegree: 3 } }
                            ]
                        }
                    ]
                }
            ]
        }
    };


    return body;
}