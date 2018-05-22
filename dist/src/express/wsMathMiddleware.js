"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const WsMathGenerator_1 = require("../worksheet/WsMathGenerator");
const latexToPdf_1 = require("../util/latexToPdf");
const MsqlStorage_1 = require("./MsqlStorage");
const WsGenerator_1 = require("../util/WsGenerator");
function generateSampleBody() {
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
}
;
function generateSampleBody0() {
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
                },
                {
                    name: "Equacions", activities: []
                },
                {
                    name: "Logaritmes", activities: [
                        {
                            formulation: "Utilitza la definició de logaritme  per calcular el valor de de $x$ en les equacions següents", questions: [
                                { gen: "arithmetics/logarithm/definition", repeat: 6, options: { interval: 10 } }
                            ]
                        }
                    ]
                },
                {
                    name: "Funcions", activities: []
                }
            ]
        }
    };
    return body;
}
//Mysql - Cache is cleared after 5 minutes
const deltaTime = 5 * 60 * 1000;
function generateDocument(doc, res) {
    const generator = new WsMathGenerator_1.WsMathGenerator(doc);
    generator.create(doc);
    if (doc.type === 'html') {
        const htmlPage = generator.exportAs(WsMathGenerator_1.WsExportFormats.HTML);
        res.setHeader("Content-type", "text/html");
        res.status(200).send(htmlPage);
    }
    else if (doc.type === 'tex' || doc.type === 'latex') {
        const tex = generator.exportAs(WsMathGenerator_1.WsExportFormats.LATEX);
        res.setHeader("Content-type", "text/plain");
        res.status(200).send(tex);
    }
    else if (doc.type === 'moodlexml') {
        const tex = generator.exportAs(WsMathGenerator_1.WsExportFormats.MOODLEXML);
        res.setHeader("Content-type", "text/plain");
        res.status(200).send(tex);
    }
    else {
        const tex = generator.exportAs(WsMathGenerator_1.WsExportFormats.LATEX);
        const outputStream = latexToPdf_1.latexToPdf(tex);
        outputStream.on("error", function (err) {
            res.status(400).send("Error producing pdf:: " + err);
            return;
        });
        res.setHeader("Content-type", "application/pdf");
        outputStream.pipe(res);
    }
}
function wsMathMiddleware(options) {
    options = Object.assign({ basePrefix: '' }, options);
    if (!options.storage) {
        options.storage = new MsqlStorage_1.MysqlStorage();
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
    router.post(url, function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const uid = yield options.storage.save(body, req.query.idUser, req.query.persist);
            res.send({ id: uid });
        });
    });
    /***
     * Gets a document by its id
     * optional query params type, seed
     */
    url = base + '/';
    router.get(url, function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.query.id;
            let doc = yield options.storage.load(id);
            if (!doc) {
                res.render('notfound', {
                    id: id
                });
            }
            else {
                // Pass extra information from query params
                if (req.query.seed) {
                    doc.seed = req.query.seed;
                }
                if (req.query.type) {
                    doc.type = req.query.type;
                }
                if (req.query.fullname) {
                    doc.fullname = req.query.fullname;
                }
                if (req.query.username) {
                    // get fullname of this username
                    doc.seed = req.query.username;
                    const user = yield options.storage.userByUsername(req.query.username);
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
                    const user = yield options.storage.userByIdUser(req.query.idUser);
                    if (user) {
                        doc.fullname = user["fullname"];
                        if (user["idRole"] < 200) {
                            doc.includeKeys = true;
                        }
                    }
                }
                // Generate document
                try {
                    generateDocument(doc, res);
                }
                catch (Ex) {
                    console.log("An error occurred while generating the document::", Ex);
                }
            }
        });
    });
    url = (options.basePrefix || '') + '/wsmath/editor';
    router.get(url, function (req, res, next) {
        const textarea = JSON.stringify(generateSampleBody0(), null, 2)
            .replace(/"/g, "\\\"").replace(/\n/g, "\\n");
        const uri = (options.basePrefix || '') + '/wsmath';
        res.render("editor", {
            textarea: textarea,
            url: uri,
            questionTypesList: Object.keys(WsGenerator_1.Container).sort(),
            questionTypesMeta: WsGenerator_1.Container,
            user: { id: 0, fullname: "Admin", username: "admin" }
        });
    });
    return router;
}
exports.wsMathMiddleware = wsMathMiddleware;
//# sourceMappingURL=wsMathMiddleware.js.map