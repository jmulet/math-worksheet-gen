import { Router, Response } from "express";
import { wsMathMdwOptions } from "../wsMathMiddleware";
import { Request } from "express-serve-static-core"; 
import { tikz2Img } from "../../dynimg/tikz2img";
import { gnp2Img } from "../../dynimg/gnp2Img";

const brokenImg = "";

export function dynImgRoute(router: Router, options: wsMathMdwOptions) {

    // General purpose image editor
    router.get(options.basePrefix + "/i", function (req: Request, res: Response) {
        res.render("imageEditor.ejs");
    });

    // Generate and image from tikz cmd
    router.get(options.basePrefix + "/i/tikz/:format/", function (req: Request, res: Response) {
        const cmd = req.query.cmd || "";
        let format:string = req.params.format;

        const latex = `
        \\documentclass[crop,multi=false]{standalone}
        \\usepackage{pgfplots}
        \\pgfplotsset{compat=newest}
        \\makeatletter
        \\nofiles
        \\begin{document}
        \\begin{tikzpicture}
        ${cmd}
        \\end{tikzpicture}
        \\end{document}`;

        if (format === "svg") {
            res.setHeader("Content-Type", "image/svg+xml");
        } else if (format === "pdf") {
            res.setHeader("Content-Type", "application/pdf");
        } else if (format.startsWith("png")) {
            res.setHeader("Content-Type", "image/png");
        } else if (format.startsWith("jpg") || format.startsWith("jpeg")) {
            res.setHeader("Content-Type", "image/jpeg");
        } 

        tikz2Img(latex, format).then((img) => {
            res.send(img);
        }, (err) => {            
            res.send(brokenImg);
        });

    });



    // Generate and image from gnuplot script
    router.get(options.basePrefix + "/i/gnp/:format/", function (req: Request, res: Response) {
        const cmd = req.query.cmd || "";
        let format:string = req.params.format;

        if (format === "svg") {
            res.setHeader("Content-Type", "image/svg+xml");
        } else if (format === "pdf") {
            res.setHeader("Content-Type", "application/pdf");
        } else if (format.startsWith("png")) {
            res.setHeader("Content-Type", "image/png");
        } else if (format.startsWith("jpg") || format.startsWith("jpeg")) {
            res.setHeader("Content-Type", "image/jpeg");
        } 

        gnp2Img(cmd, format).then((img) => {
            res.send(img);
        }, (err) => {            
            res.send(brokenImg);
        });

    });

}



