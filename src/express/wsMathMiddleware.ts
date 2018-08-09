import * as express from 'express';
import { Response } from 'express-serve-static-core';

import { latexToPdf } from '../util/latexToPdf';
import { Container } from '../util/WsGenerator';
import { WsExportFormats, WsMathGenerator } from '../worksheet/WsMathGenerator';
import { generateSample4ESO } from './generateSample4ESO';
import { generateSample1BAT } from './generateSample1BAT';
import { MysqlStorage } from './MsqlStorage';
import { Storage } from './Storage';
import { Store } from 'tough-cookie';

export interface wsMathMdwOptions {
    basePrefix?: string;
    storage?: Storage;
    piworldUrl?: string;
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

function displayGenerated(type: string, doc: string, res: Response) {
    if (type === 'html') {
        res.setHeader("Content-type", "text/html");
        res.status(200).send(doc);
    } else if (type === 'tex' || type === 'latex') {
        res.setHeader("Content-type", "text/plain");
        res.status(200).send(doc);
    }
}

function generateDocument(uid: string, doc: any, storage: Storage, isSaved: boolean, res: Response) {
    const generator = new WsMathGenerator(doc);
    generator.create(doc);

    if (doc.type === 'html') {
        const htmlPage = generator.exportAs(uid, WsExportFormats.HTML);
        res.setHeader("Content-type", "text/html");
        res.status(200).send(htmlPage);

        if (isSaved) {
            const htmlPageWithKeys = generator.exportAs(uid, WsExportFormats.HTML, true);
            storage.saveGenerated(uid, doc.seed, "html", htmlPage, htmlPageWithKeys);
        }

    } else if (doc.type === 'tex' || doc.type === 'latex') {
        const tex = generator.exportAs(uid, WsExportFormats.LATEX);
        res.setHeader("Content-type", "text/plain");
        res.status(200).send(tex);

        if (isSaved) {
            const texWithKeys = generator.exportAs(uid, WsExportFormats.LATEX, true);
            storage.saveGenerated(uid, doc.seed, "latex", tex, texWithKeys);
        }
    } else if (doc.type === 'moodlexml') {
        const tex = generator.exportAs(uid, WsExportFormats.MOODLEXML);
        res.setHeader("Content-type", "text/plain");
        res.status(200).send(tex);
    } else {
        const tex = generator.exportAs(uid, WsExportFormats.LATEX);

        const outputStream = latexToPdf(tex);
        outputStream.on("error", function (err) {
            res.status(400).send("Error producing pdf:: " + err);
            return;
        });
        res.setHeader("Content-type", "application/pdf");
        outputStream.pipe(res);

    }
}


export function wsMathMiddleware(options?: wsMathMdwOptions) {
    options = { basePrefix: '', piworldUrl: 'https://piworld.es', ...options };
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
        const seed = req.query.seed + "b";
        const type = req.query.type;
        // Intenta primer mirar si ja ha estat generat i si no el genera
        let gen = await options.storage.loadGenerated(id, seed);

        if (gen && gen[type]) {
            let generated = gen[type];
            if (req.query.includeKeys) {
                generated = gen[type + "_keys"];
            }
            displayGenerated(type, generated, res);
            return;
        }

        // Normal flow if not generated
        const row = await options.storage.load(id);
        //if (!row) {
        const doc = row.json;
        const isSaved = row.saved;

        if (!doc) {
            res.render('notfound', {
                id: id
            });
            return;
        } 


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
        try {
            generateDocument(id, doc, options.storage, isSaved, res);
        } catch (Ex) {
            console.log("An error occurred while generating the document::", Ex);
        }

    });


    url = (options.basePrefix || '') + '/wsmath/editor';
    router.get(url, function (req: express.Request, res: express.Response, next: express.NextFunction) {
        const session = req.session;
      
        session.reload(function (err) {
            
            if (!session ||  !session.user) {                
                const redirect_url = options.piworldUrl + "/?app=wsmath/editor";
                console.log(redirect_url); 
                res.status(301).redirect(encodeURI(redirect_url));
                return;
            }

            const textarea: string = JSON.stringify(generateSample1BAT(), null, 2)
                .replace(/"/g, "\\\"").replace(/\n/g, "\\n");

            const uri = (options.basePrefix || '') + '/wsmath';
            res.render("editor", {
                textarea: textarea,
                url: uri,
                questionTypesList: Object.keys(Container).sort(),
                questionTypesMeta: Container,
                user: { id: 0, fullname: "Admin", username: "admin" }
            });
        });

    });

    //This provides a report of the generated pages
    //Requires the id or ids of the worksheets
    url = (options.basePrefix || '') + '/wsmath/generated';
    router.get(url, function (req: express.Request, res: express.Response, next: express.NextFunction) {

        const ids: string[] = req.params.ids.split(",");
        
        const reports = ids.map((id) => {
            return options.storage.loadGenerated(id);
        });

        const uri = (options.basePrefix || '') + '/wsmath';
        res.render("generated", {
            url: uri,
            reports: reports
        });
    });

    return router;
}



