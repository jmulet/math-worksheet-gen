import { Router, Response } from "express";
import { wsMathMdwOptions } from "../wsMathMiddleware";
import { Request } from "express-serve-static-core"; 
import { tikz2Img } from "../../dynimg/tikz2img";
import { gnp2Img } from "../../dynimg/gnp2Img";
import { ggb2Img } from "../../dynimg/ggb2Img";

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


     // Generate and image from geogebra script
     router.get(options.basePrefix + "/i/ggb/:format/", function (req: Request, res: Response) {
        const cmd = req.query.cmd || "";
        let format:string = req.params.format;

        if (format.startsWith("svg")) {
            res.setHeader("Content-Type", "image/svg+xml");
        } else if (format === "pdf") {
            res.setHeader("Content-Type", "application/pdf");
        } else if (format.startsWith("png")) {
            res.setHeader("Content-Type", "image/png");
        } else if (format.startsWith("jpg") || format.startsWith("jpeg")) {
            res.setHeader("Content-Type", "image/jpeg");
        } else if (format.startsWith("ggb")) {
            res.setHeader("Content-Type", "application/zip");
        } 
        ggb2Img(cmd, format + "600,600", false).then((img) => {
            if (format.startsWith("pdf")) {
                res.setHeader("Content-Disposition", "attachment;filename=file.pdf");
                res.setHeader("Content-length", (<Buffer> img).byteLength + "");
            } else if (format.startsWith("ggb")) {
                res.setHeader("Content-Type", "application/ggb");
                res.setHeader("Content-Disposition", "attachment;filename=file.ggb");
                res.setHeader("Content-length", (<Buffer> img).byteLength + "");
            }
            res.send(img);
        }, (err) => {       
            console.log(err)     
            res.send(brokenImg);
        });

    });

}



