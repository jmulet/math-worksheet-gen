import { Request, Response, NextFunction, Router } from 'express';
import { sendGeneratedSheet } from '../services/sendGeneratedSheet';
import { generateSheet } from '../services/generateSheet';
import { storeGeneratedSheets } from '../services/storeGeneratedSheet';
import { formatDate } from './editorRoute';
import { latexToOOO } from '../../util/latexToOOO';
import { Worksheet } from '../../interfaces/WsMathGenOpts';
import { WsMathGenerator } from '../../worksheet/WsMathGenerator';
import { AbstractDocumentTree } from '../../interfaces/AbstractDocumentTree';
import { latexToPdf } from '../../util/latexToPdf';

export function assertTrue(value: string) {
    if (value) {
        value = value.toLowerCase().trim();
        return value !== "0" && value !== "false";
    }
    return false;
}

/***
 * Gets a generatedSheet by its uid [required]
 * Optional pass query params type, seed, ...
 **/
export function downloadRoute(router: Router, options) {

    const base = (options.basePrefix || '');
    const url = base + '/g/:sid';
    router.get(url, async function (req: Request, res: Response, next: NextFunction) {
        const uid = req.params["sid"];
        const loggedUser = req["session"].user;
        const isTeacher = loggedUser && loggedUser.idRole < 200;
        const forceGen = assertTrue(req.query.force);

        
        if (!uid) {
            res.status(404).render("notfound.ejs", {
                id: "?"
            });
            return;
        }

        const worksheet = await options.storage.load(uid);
        const owner = worksheet.idUser === req["session"].user.id;

        if (!worksheet || !worksheet.json || (worksheet.visibility === 0 && !owner)) {
            //Alerta es demana un document que no existeix --> envia un 404
            res.status(404).render("notfound.ejs", {
                id: uid
            });
            return;
        }

        // The sheet must be generated
        // Load the worksheet definition which will be used to generate the sheet
        const doc = <Worksheet> worksheet.json;
        doc.sid = uid;
        doc.lang = doc.lang || "ca";
        const isShared = worksheet.visibility !== 0;

        // Override db worksheet information with extra information passed from query params
        if (isTeacher && req.query.keys != null) {
            try {
                doc.includeKeys = parseInt(req.query.keys);
            } catch (Ex) { }
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

        const now = new Date();

       
        // Te una data d'apertura
        if (!isTeacher && worksheet.opens) {
            const opens = new Date(worksheet.opens);
            if (opens.getTime() > now.getTime()) {
                res.status(200).render("notavailable.ejs", {
                    id: uid,
                    opens: formatDate(opens),
                    closes: "",
                    keysOpens: ""
                });
                return;
            }
        }

        // Te una data de tancada
        if (!isTeacher && worksheet.closes) {
            const closes = new Date(worksheet.closes);
            if (closes.getTime() < now.getTime()) {
                res.status(200).render("notavailable.ejs", {
                    id: uid,
                    closes: formatDate(closes),
                    opens: "",
                    keysOpens: ""
                });
                return;
            }
        }

        // Te una data d'apertura de solucions
        if (!isTeacher && worksheet.keysOpens && assertTrue(req.query.keys)) {
            // Try to see if we are asking more keys than those in json includeKeys 
            let showKeys = worksheet.includeKeys;
            try {
                showKeys = parseInt(req.query.keys);
            } catch (Ex) { }
            if (showKeys > worksheet.includeKeys) {
                const keysOpens = new Date(worksheet.keysOpens);
                if (keysOpens.getTime() > now.getTime()) {
                    res.status(200).render("notavailable.ejs", {
                        id: uid,
                        keysOpens: formatDate(keysOpens),
                        closes: "",
                        opens: ""
                    });
                    return;
                }
            }
        }

        const type = (req.query.type ||  worksheet.json.type ||  "html").toLowerCase().trim();
        let keysType = 0;
        if (req.query.keys) {
            try {
                keysType = parseInt(req.query.keys);
            } catch (Ex) { }
        } else {
            keysType = worksheet.json.includeKeys ||  0;
        }
        let seed = req.query.seed;

         // Es tracta de l'ADT
         if (!isTeacher && type === "json") {
            res.status(200).render("notavailable.ejs", {
                id: uid,
                keysOpens: "",
                closes: "",
                opens: ""
            });
            return;
         }


        // pseudo seeds are
        // request IP  %IP%

      
        //seed-less requests must Always be generated!
        let adt: AbstractDocumentTree;
        const loadedADT = (await options.storage.loadGenerated(uid, seed, "json", keysType))[0];
        if (loadedADT) {
            try {
                adt = JSON.parse(loadedADT.doc);
            } catch(Ex) {}
        }

        if (seed && !forceGen && loadedADT) {
            if (type === "json") {

                sendGeneratedSheet("json", loadedADT.doc, res);
                return;

            } else if (["pdf", "odt", "docx"].indexOf(type) >= 0) {

                if (type === "pdf")  {
                    const loadedPDF = (await options.storage.loadGenerated(uid, seed, "pdf", keysType))[0];
                    if (loadedPDF) {
                        res.setHeader("Content-Disposition", "attachment; filename=\"" + uid + "." + type + "\"");
                        res.setHeader("Content-Length", loadedPDF.docBuffer.byteLength);
                        sendGeneratedSheet("pdf", loadedPDF.docBuffer, res);
                        return;
                    }
                }

                // PDF can be generated from latex
                // DOCX or ODT are never stored, so simply check for type=latex
                const loadedLatex = (await options.storage.loadGenerated(uid, seed, "latex", keysType))[0];
                if (loadedLatex) {
                    const generated = loadedLatex["doc"];
                    let ooo;
                    if (type === "pdf") {
                        ooo = await latexToPdf(generated);                        
                        // store
                        storeGeneratedSheets(doc, {"pdf": ooo}, options.storage)
                    } else {
                        ooo = await latexToOOO(generated, { type: type });                        
                    }                    
                    res.setHeader("Content-Disposition", "attachment; filename=\"" + uid + "." + type + "\"");
                    res.setHeader("Content-Length", ooo.byteLength);
                    sendGeneratedSheet(type, ooo, res);
                    return;
                }   
            } else {
                // This block is for types html and latex
                const loaded = (await options.storage.loadGenerated(uid, seed, type, keysType))[0];
                if (loaded) {
                    sendGeneratedSheet(type, loaded.doc, res);
                }
            }

        }


        if (req.query.seed && !req.query.username && !req.query.idUser) {
            req.query.username = req.query.seed;
        }
        if (req.query.username) {
            // get fullname of this username
            doc.seed = req.query.username;
            const user = await options.storage.userByUsername(req.query.username);
            if (user) {
                doc.fullname = user["fullname"];
            }
        }
        if (req.query.idUser) {
            // get fullname of this idUser
            doc.seed = req.query.idUser;
            const user = await options.storage.userByIdUser(req.query.idUser);
            if (user) {
                doc.fullname = user["fullname"];
            }
        }

        // Parse document, generate sheet and send
        try {
            const sheetInstance = await generateSheet(doc, adt);
            console.log(doc.seed, isShared);
            if (doc.seed && isShared) {
                //Storable document
                console.log("store")
                storeGeneratedSheets(doc, sheetInstance, options.storage);
            }
            // Finally display sheet to the end user
            const docToDisplay = sheetInstance[doc.type];
            await sendGeneratedSheet(type, docToDisplay, res);

        } catch (Ex) {
            console.log(Ex);
            if (!res.headersSent) {
                res.status(500).render("internalError.ejs", {
                    msg: Ex
                });
            } else {
                console.log(Ex);
            }
        }

    });

};