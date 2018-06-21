import * as express from "express";
import { WsMathGenerator, WsExportFormats } from "../worksheet/WsMathGenerator";
import { latexToPdf } from '../util/latexToPdf';
import { Stream } from "stream";
import { Response } from "express-serve-static-core";
import { MysqlStorage } from "./MsqlStorage";
import { Storage } from "./Storage";
import { Container } from "../util/WsGenerator";
import * as httpRequest from 'request';
import { generateSample4ESO } from './generateSample4ESO';

export interface wsMathMdwOptions {
    basePrefix: string;
    storage: Storage;
}

function generateMoodleSample() {
    var body = {

        worksheet: {
            includeKeys: true,
            title: "Moodle test",
            sections: [
                {
                    name: "Coniques", activities: [
                        {
                            formulation: "Calcula l'excentricitat",
                            questions: [
                                { gen: "geometry/conics/excentricity", repeat: 6, options: { interval: 5 } }
                            ]
                        } 
                    ]
                }
            ]
        }
    };
    
    return body;
};






//Mysql - Cache is cleared after 5 minutes
const deltaTime = 5 * 60 * 1000;

function generateDocument(doc: any, res: Response) {
    const generator = new WsMathGenerator(doc);
    generator.create(doc);
    if (doc.type === 'html') {
        const htmlPage = generator.exportAs(WsExportFormats.HTML);
        res.setHeader("Content-type", "text/html");
        res.status(200).send(htmlPage);
    } else if (doc.type === 'tex' || doc.type === 'latex') {
        const tex = generator.exportAs(WsExportFormats.LATEX);
        res.setHeader("Content-type", "text/plain");
        res.status(200).send(tex);
    } else if (doc.type === 'moodlexml') {
        const tex = generator.exportAs(WsExportFormats.MOODLEXML);
        res.setHeader("Content-type", "text/plain");
        res.status(200).send(tex);
    } else {
        const tex = generator.exportAs(WsExportFormats.LATEX);
        
            const outputStream = latexToPdf(tex);
            outputStream.on("error", function(err){
                res.status(400).send("Error producing pdf:: "+ err);
                return;
            });
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
            // Pass extra information from query params
            if (req.query.includeKeys === "true") {
                doc.includeKeys = true;
            }
            if (req.query.seed) {
                doc.seed = req.query.seed;
            }
            if (req.query.type) {
                doc.type = req.query.type;
            }
            if (req.query.fullname) {
                doc.fullname = req.query.fullname;
            }
            if (req.query.seed && !req.query.username && !req.query.idUser) {
                req.query.username = req.query.seed + "b";
            }
            if (req.query.username) {
                // get fullname of this username
                doc.seed = req.query.username;
                const user = await options.storage.userByUsername(req.query.username);
                if (user) {
                    doc.fullname = user["fullname"];
                    if (user["idRole"] < 200) {
                        doc.includeKeys = true;
                    }
                }
            }
            if (req.query.idUser) {
                // get fullname of this idUser
                doc.seed = req.query.idUser;
                const user = await options.storage.userByIdUser(req.query.idUser);
                if (user) {
                    doc.fullname = user["fullname"];
                    if (user["idRole"] < 200) {
                        doc.includeKeys = true;
                    }
                }
            }
            // Generate document
            try  {
                generateDocument(doc, res);
            } catch (Ex) {
                console.log("An error occurred while generating the document::", Ex);
            }
        }
    });


    url = (options.basePrefix || '') + '/wsmath/editor';
    router.get(url, function (req: express.Request, res: express.Response, next: express.NextFunction) {
 
            const textarea: string = JSON.stringify(generateSample4ESO(), null, 2)
                .replace(/"/g, "\\\"").replace(/\n/g, "\\n");
 
            const uri = (options.basePrefix || '') + '/wsmath';
            res.render("editor", {
                textarea: textarea,
                url: uri,
                questionTypesList: Object.keys(Container).sort(),
                questionTypesMeta: Container,
                user: {id: 0, fullname: "Admin", username:"admin"}
            });
        });

 
    return router;
}



 