import { Router, Response } from "express";
import { wsMathMdwOptions } from "../wsMathMiddleware";
import { Request } from "express-serve-static-core";
import * as temp from "temp";
import * as fs from "fs";
import * as fse from "fs-extra";
import * as path from "path";
import { spawn } from "child_process";
const strToStream = require('string-to-stream')

export function dynImgRoute(router: Router, options: wsMathMdwOptions) {

    // Generate and image from tickz cmd
    router.get(options.basePrefix + "/tikz/:format/", async function (req: Request, res: Response) {
        const cmd = req.query.cmd || "";
        
        // ,convert={outext=.svg,command=\\unexpanded{pdf2svg \\infile.pdf\\space\\outfile}}
        const latex = `
        \\documentclass[crop,tikz,multi=false]{standalone}
        %\\usetikzlibrary{...}% tikz package already loaded by 'tikz' option
        \\makeatletter
        \\nofiles
        \\begin{document}
        \\begin{tikzpicture}
        ${cmd}
        \\end{tikzpicture}
        \\end{document}`;

        
        tikz2Img(latex, 'svg').then( (img) => {            
            res.setHeader("Content-Type", "image/svg+xml");
            res.send(img);
        }, (err) => {  res.send("Internal error") }
        
        );
        
    });

}



function tikz2Img(src: string, type: string): Promise<string> {

    return new Promise((resolve, reject) => {
        // pdflatex -shell-escape filename.tex
        const dirname = "tikz-svg-" + Math.random().toString(32).substring(2);
        temp.mkdir(dirname, (err, tempPath) => {
            let inputStream = strToStream(src)             
            const args = [
                '-shell-escape'
            ]
            const opts = {
                cwd: tempPath,
                env: Object.assign({}, process.env, {
                })
            }

            /**
             * Runs a LaTeX child process on the document stream
             * and then decides whether it needs to do it again.
             */
        
                const tex = spawn("pdflatex", args, opts)
                inputStream.pipe(tex.stdin)

                const handleErrors = function(err) {
                    reject(err);
                }

                // Prevent Node from crashing on compilation error.
                tex.stdin.on('error', handleErrors)

                tex.on('error', () => {
                    handleErrors(new Error(`Error: Unable to run cmd command.`))
                })

                tex.stdout.on('data', (data) => { });
                tex.stderr.on('data', (data) => {  });
                tex.on('close', (code) => {  });
                tex.on('exit', (code) => {
                    if (code !== 0) {                        
                        reject(code + "");
                    }
                    returnDocument();
                })
            

            /**
             * Returns the IMAGE
             */
            const returnDocument = () => {
                // convert pdf to svg
                const svg = spawn("pdf2svg", ["texput.pdf", "texput.svg"], {
                    cwd: tempPath
                })
                
                svg.on("error", handleErrors);
                svg.on("exit", (code)=> {                    
                    const svgPath = path.join(tempPath, 'texput.svg')
                    fs.readFile(svgPath, { encoding: "utf8"}, function (err, buffer) {
                        if (err) {
                            console.log(err);
                            reject(err);
                            return;
                        }
                        resolve(buffer);
                        fse.remove(tempPath);              
                    });
                });               
            }
        });
    });
}
        


