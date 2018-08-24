import { Router, Request, Response } from "express";

export function homeRoute(router: Router, options) {
    
    let url = (options.basePrefix || '');
    
    router.get(url, function (req: Request, res: Response) {
        
        res.render("home.ejs", {});
    });
}