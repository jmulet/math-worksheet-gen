import * as express from "express";
import { WsMathGenerator, WsExportFormats } from "../worksheet/WsMathGenerator";
import { latexToPdf } from '../util/latexToPdf';
import { Stream } from "stream";
import { Response } from "express-serve-static-core";
import { MysqlStorage } from "./MsqlStorage";
import { Storage } from "./Storage"; 
import { Container } from "../util/WsGenerator";

export interface wsMathMdwOptions {
    basePrefix: string;
    storage: Storage;
}

//Mysql - Cache is cleared after 5 minutes
const deltaTime = 5 * 60 * 1000;

function generateDocument(doc: any, res: Response) {
    const generator = new WsMathGenerator(doc);

    if (doc.type === 'html') {
        const htmlPage = generator.exportAs(WsExportFormats.HTML);
        res.setHeader("Content-type", "text/html");
        res.status(200).send(htmlPage);
    } else if (doc.type === 'tex' || doc.type === 'latex') {
        const tex = generator.exportAs(WsExportFormats.LATEX);
        res.setHeader("Content-type", "text/plain");
        res.status(200).send(tex);
    } else {
        const tex = generator.exportAs(WsExportFormats.LATEX);
        const outputStream = latexToPdf(tex);
        res.setHeader("Content-type", "application/pdf");
        outputStream.pipe(res);
    }
}


export function wsMathMiddleware(options?: wsMathMdwOptions) {
    options = { basePrefix: '', ...options };
    if (!options.storage) {
        options.storage = new MysqlStorage();
    }

    setInterval(function () {
        options.storage.clear();
    }, deltaTime);

    const router = express.Router();


    /**
     * Posts the document structure in json format and returns the stored document id
     */
    const base = (options.basePrefix || '') + '/wsmath';
    let url = base + '/store';
    router.post(url, async function (req: express.Request, res: express.Response, next: express.NextFunction) {
        const seed = req.query.seed;
        let body = req.body;
        if (!body) {
            body = {};
        }
        if (typeof (body) === 'string') {
            body = JSON.parse(body);
        }

        body.type = req.query.type || 'html';
        body.seed = (seed == 0 ? '' : seed);
        body.baseURL = base;

        const uid = await options.storage.save(body, req.query.idUser, req.query.persist);
        res.send({ id: uid });
    });

    /***
     * Gets a document by its id
     * optional query params type, seed
     */

    url = base + '/';
    router.get(url, async function (req: express.Request, res: express.Response, next: express.NextFunction) {
        const id = req.query.id;
        let doc = await options.storage.load(id);

        if (!doc) {
            res.render('notfound', {
                id: id
            });
        } else {
            console.log(req.query);
            // Pass extra information from query params
            if (req.query.seed) {
                doc.seed = req.query.seed;
            }
            if (req.query.type) {
                doc.type = req.query.type;
            }
            if (req.query.fullname) {
                doc.worksheet.fullname = req.query.fullname;
            } 

            // Generate document
            try {
                generateDocument(doc, res);
            } catch(Ex) {
                console.log("An error occurred while generating the document");
            }
        }
    });


    url = (options.basePrefix || '') + '/wsmath/editor';
    router.get(url, function (req: express.Request, res: express.Response, next: express.NextFunction) {

        const textarea: string = JSON.stringify(generateSampleBody(), null, 2)
            .replace(/"/g, "\\\"").replace(/\n/g, "\\n");

        const uri = (options.basePrefix || '') + '/wsmath';         
        res.render("editor", {
            textarea: textarea,
            url: uri,
            questionTypesList: Object.keys(Container).sort(),
            questionTypesMeta: Container
        });
    });

    return router;
}


function generateSampleBody() {
    var body = {

        worksheet: {
            includeKeys: true,
            title: "Feina d'estiu alumnes que han de cursar MAT-I a 1r de Batxillerat",
            instructions: "Realitzeu aquesta tasca en el quadern de l'assignatura del proper curs i entregeu-lo al professor del proper any. Aquesta feina serà comptava com a nota de la 1a avaluació.",
            sections: [
                {
                    name: "Radicals", activities: [
                        {
                            formulation: "Escriu les potències en forma d'arrel i viceversa",
                            questions: [
                                { gen: "arithmetics/radicals/notation", repeat: 6, options: { maxIndex: 5 } }
                            ]
                        },
                        {
                            formulation: "Treu factors i simplifica els radicals si és possible",
                            questions: [
                                { gen: "arithmetics/radicals/simplify", repeat: 4, options: { maxIndex: 5 } }
                            ]
                        },
                        {
                            formulation: "Opera els radicals",
                            questions: [
                                { gen: "arithmetics/radicals/operations", repeat: 4, options: {} },
                                { gen: "arithmetics/radicals/operations", repeat: 2, options: { algebraic: true } }
                            ]
                        },
                        {
                            formulation: "Simplifica els radicals",
                            questions: [
                                { gen: "arithmetics/radicals/gather", repeat: 2, options: { maxIndex: 2 } },
                                { gen: "arithmetics/radicals/gather", repeat: 2, options: { domain: 'Q' } }
                            ]
                        },
                        {
                            formulation: "Racionalitza els radicals",
                            questions: [
                                { gen: "arithmetics/radicals/rationalize", repeat: 2, options: {} },
                                { gen: "arithmetics/radicals/rationalize", repeat: 2, options: { conjugate: true } }
                            ]
                        }
                    ]
                },
                {
                    name: "Polinomis", activities: [
                        {
                            formulation: "Divideix aquests polinomis utilitzant la regla de Ruffini", questions: [
                                { gen: "algebra/polynomial/division", repeat: 4, options: { ruffini: true } }
                            ]
                        },
                        {
                            formulation: "Divideix els polinomis", questions: [
                                { gen: "algebra/polynomial/division", repeat: 4, options: { fraction: false, maxDegree: 4, interval: 5 } }
                            ]
                        },
                        {
                            formulation: "Expandeix les identitats notables.", questions: [
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 1 } },
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 2 } },
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 3 } }
                            ]
                        },
                        {
                            formulation: "Escriu, si és possible, aquests polinomis com una identitat notable.", questions: [
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 1, indirect: true } },
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 3, indirect: true } }
                            ]
                        },
                        {
                            formulation: "Extreu factor comú dels polinomis", questions: [
                                { gen: "algebra/polynomial/commonfactor", repeat: 3, options: { interval: 5, complexity: 1 } }
                            ]
                        },
                        {
                            formulation: "Factoritza els polinomis", questions: [
                                { gen: "algebra/polynomial/factorize", repeat: 4, options: { interval: 5, complexity: 1, maxDegree: 4, allowFractions: true } }
                            ]
                        },
                        {
                            formulation: "Simplifica les fraccions algebraiques", questions: [
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