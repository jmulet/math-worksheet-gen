import { Router, Request, Response } from "express";
import { wsMathMdwOptions } from "../wsMathMiddleware";
import { formatDate } from "./editorRoute";

export function homeRoute(router: Router, options: wsMathMdwOptions) {    
    let url = (options.basePrefix || '');
    
    router.get(url, async function (req: Request, res: Response) {        
        const amTeacher = req["session"].user && req["session"].user.idRole<200;
        const publicTemplates = await options.storage.load();
        res.render("home.ejs", {
            templates: publicTemplates || [],
            amTeacher: amTeacher,
            formatDate: formatDate
        });
    });
}