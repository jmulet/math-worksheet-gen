import { Router, Request, Response, NextFunction } from "express";
import { Container } from "../../util/WsGenerator";
import { wsMathMdwOptions } from "../wsMathMiddleware";

function pad(n: number): string {
    if (n < 10) {
        return "0"+n;
    }
    return ""+n;
}

export function formatDate(date: string | Date) {
    if (typeof (date) === "string") {
        date = new Date(date);
    }
    return pad(date.getDate()) + "/" + pad(date.getMonth() + 1) + "/" + date.getFullYear() + "  " + pad(date.getHours()) + ":"
        + pad(date.getMinutes());
}


export function editorRoute(router: Router, options: wsMathMdwOptions) {

    let url = (options.basePrefix || '') + "/e";

    router.get(url, async function (req: Request, res: Response) {
        const session = req["session"];
        if (!(session.user && session.user.idRole < 200)) {
            res.redirect(options.basePrefix || '');
            return;
        }

        const list = await options.storage.listTemplatesByUser(session.user.id + "");
        res.render("browser", {
            templates: list,
            user: { id: session.user.id, fullname: session.user.fullname, username: session.user.username },
            formatDate: formatDate
        });

    });

    /**
     * This route is to edit the sheet
     */

    url = (options.basePrefix || '') + "/e/:sid";
    router.get(url, async function (req: Request, res: Response) {
        const session = req["session"];
        if (!(session.user && session.user.idRole < 200)) {
            res.redirect(options.basePrefix || '');
            return;
        }

        let sid = req.params["sid"];
        if (!sid || sid === "0") {
            // create an new sheet
            const json = {
                type: "html",
                title: "Full activitats",
                baseURL: options.basePrefix,
                sections: [
                    { name: "Secció 1", activities: [] }
                ],
                sectionless: false,
                includeKeys: false
            };
            sid = await options.storage.save(json, session.user.id, 1);
        }



        const uri = (options.basePrefix || '');
        const template = await options.storage.load(sid);
        if (!template || template.idUser != session.user.id) {
            res.redirect((options.basePrefix || '') + "/e");
            return;
        }
        res.render("editor", {
            textarea: JSON.stringify(template.json).replace(/\'/g, "\\'"),
            url: uri,
            questionTypesList: Object.keys(Container).sort(),
            questionTypesMeta: Container,
            user: { id: session.user.id, fullname: session.user.fullname, username: session.user.username }
        });

    });

    /**
     * Deletes a sheet definition
     */
    router.delete(url, async function (req: Request, res: Response) {
        const session = req["session"];
        if (!(session.user && session.user.idRole < 200)) {
            res.send(404);
            return;
        }
        const sid = req.params["sid"];
        const template = await options.storage.load(sid);
        if (!template || template.idUser != session.user.id) {
            res.send(404);
        }

        const nup = await options.storage.delete(sid);
        res.send(nup ? 200 : 500);
    });

    /**
     * Clone a sheet definition
     */
    router.put(url, async function (req: Request, res: Response) {
        const session = req["session"];
        if (!(session.user && session.user.idRole < 200)) {
            res.send(404);
            return;
        }
        const sid = req.params["sid"];
        const template = await options.storage.load(sid);
        if (!template) {
            res.send(404);
        }
        template.json.title = "(copy) " + template.json.title;
        const clonedSid = await options.storage.save(template.json, session.user.id, template.save);
        res.send(clonedSid);
    });

    /**
     * updates the json column only
     */
    router.post(url, async function (req: Request, res: Response) {
        const session = req["session"];
        if (!(session.user && session.user.idRole < 200)) {
            res.send(404);
        }
        const sid = req.params["sid"];
        const template = await options.storage.load(sid);
        if (!template || session.user.id !== template.idUser) {
            res.send(404);
        }
        template.json = req.body;

        const nup = await options.storage.update(template.uid, template.json);
        res.send(nup ? 200 : 500);
    });


    //This provides a report of the generated pages
    //Requires the id or ids of the worksheets
    url = (options.basePrefix || '') + '/r/:sid';
    router.get(url, async function (req: Request, res: Response, next: NextFunction) {
        const session = req["session"];
        if (!(session.user && session.user.idRole < 200)) {
            res.redirect("/wsmath/e");
        }
        const sid = req.params["sid"];

        //Can only review own sheets
        const template = await options.storage.load(sid);
        if (!template || session.user.id !== template.idUser) {
            res.redirect("/wsmath/e");
        }
        const report = await options.storage.loadGenerated(sid);
        const uri = (options.basePrefix || '');
        res.render("generated", {
            url: uri,
            report: report,
            formatDate: formatDate
        });
    });


};