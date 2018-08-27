import {Request, Response, NextFunction, Router} from 'express';
import { sendGeneratedSheet } from '../services/sendGeneratedSheet';
import { generateSheet } from '../services/generateSheet';
import { storeGeneratedSheet } from '../services/storeGeneratedSheet';
import { formatDate } from './editorRoute';
import { latexToOOO } from '../../util/latexToOOO';

export function assertTrue(value: string) {
    if (value) {
        value = value.toLowerCase().trim();
        return value !== "0" && value !=="false";
    }
    return false;
}

/***
 * Gets a generatedSheet by its uid [required]
 * Optional pass query params type, seed, ...
 **/
export function downloadRoute(router: Router, options) {
    
    const base = (options.basePrefix || '');
    const url =  base + '/g/:sid';
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
      
        if (!worksheet || !worksheet.json || (worksheet.visibility === 0 && !owner )) {
            //Alerta es demana un document que no existeix --> envia un 404
            res.status(404).render("notfound.ejs", {
                id: uid
            });
            return;
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
         if (!isTeacher && worksheet.keysOpens && assertTrue(req.query.includeKeys) ) {             
            // Try to see if we are asking more keys than those in json includeKeys 
            let showKeys = worksheet.includeKeys;
            try {
                showKeys = parseInt(req.query.includeKeys);                
            } catch(Ex){}
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

        const type = (req.query.type || worksheet.json.type || "html").toLowerCase();
        let seed = req.query.seed;

        // pseudo seeds are
        // request IP  %IP%

        //seed-less requests must Always be generated!
        if (seed && !forceGen) {
                //seed = seed + "b";
                // Try to see if this document is already generated and stored in database with the desired type                
                let gen = await options.storage.loadGenerated(uid, seed);

                // IF LATEX is found then PDF can be generated from there
                
                if (["odt", "docx"].indexOf(type.toLowerCase())>=0) {
                    // DOCX or ODT are never stored, so simply check for type=latex
                    let generated = gen["latex"];
                    if (assertTrue(req.query.includeKeys)) {
                        generated = gen["latex_keys"];
                    } 
                    const ooo = await latexToOOO(generated, {type: type.toLowerCase().trim()});
                    res.setHeader("Content-Disposition", "attachment; filename=\"" + uid + "." + type + "\"");
                    res.setHeader("Content-Length", ooo.byteLength);
                    sendGeneratedSheet(type, ooo, res);
                    return;

                } else {

                    if (gen && gen[type]) {
                        let generated = gen[type];
                        if (assertTrue(req.query.includeKeys)) {
                            generated = gen[type + "_keys"];
                        } 
                        sendGeneratedSheet(type, generated, res);
                        return;
                    }

                }

                
        }
        
        // The sheet must be generated
        // Load the worksheet definition which will be used to generate the sheet
      

        const doc = worksheet.json;
        const isShared = worksheet.saved;
 
        // Override db worksheet information with extra information passed from query params
        if (isTeacher && req.query.includeKeys!=null) {
            try {
                doc.includeKeys = parseInt(req.query.includeKeys);
            } catch(Ex){}
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
     
        // Generate document
        try {
            const sheetInstance = await generateSheet(uid, doc);
            if (doc.seed && isShared) {
                //Storable document
                storeGeneratedSheet(sheetInstance, options.storage);
            }
            // Finally display sheet to the end user
            let docToDisplay;
            if (sheetInstance.ooo) {
                docToDisplay = sheetInstance.ooo;
            } else {
                docToDisplay = doc.includeKeys? sheetInstance.sheetWithkeys : sheetInstance.sheet;
            }
            await sendGeneratedSheet(type, docToDisplay, res);
        
        } catch (Ex) {
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