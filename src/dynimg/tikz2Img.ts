import * as temp from "temp";
import * as fs from "fs";
import * as fse from "fs-extra";
import * as path from "path";
import { spawn } from "child_process";
import * as mime from "mime-types";
const strToStream = require('string-to-stream')

/**
 * Transforms a tikz/pgf code into an image of type optionally converted to base64
 */

export function tikz2Img(src: string, type: string, toBase64?: boolean): Promise<Buffer | string> {

    return new Promise((resolve, reject) => {
        // pdflatex -shell-escape filename.tex
        const dirname = "tikz2Img-" + Math.random().toString(32).substring(2);
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

            const handleErrors = function (err) {
                reject(err);
            }

            // Prevent Node from crashing on compilation error.
            tex.stdin.on('error', handleErrors)

            tex.on('error', () => {
                handleErrors(new Error(`Error: Unable to run cmd command.`))
            })

            tex.stdout.on('data', (data) => { });
            tex.stderr.on('data', (data) => { });
            tex.on('close', (code) => { });
            tex.on('exit', (code) => {
                if (code !== 0) {
                    reject(code + "");
                } else {
                    if (type === "pdf") {
                        returnDocument("pdf");
                    } else {
                        convert2Img(type);
                    }
                }
            });


            /**
             * Converts texput.pdf to image texput.<<formatExt>>
             */
            const convert2Img = (format: string) => {
                let formatExt = format.toLowerCase();
                let dpi = "300";
                if (formatExt.indexOf("-")>=0) {
                    const parts = formatExt.split("-");
                    formatExt = parts[0];
                    dpi = parts[1];
                }
                
                let converter: string;
                const args = [];
                if (formatExt === "svg") {
                    converter = "pdf2svg";
                    args.push("texput.pdf");
                    args.push("texput." + formatExt);
                } else {
                    converter = "gs";
                    args.push("-r"+dpi);
                    if (format === "pngalpha") {
                        formatExt = "png";
                        args.push("-sDEVICE=pngalpha");
                    } else if (format === "png") {
                        args.push("-sDEVICE=png16m");
                        args.push("-dTextAlphaBits=4");
                    } else if (format === "jpg" || format === "jpeg") {
                        args.push("-sDEVICE=jpeg");
                        args.push("-dTextAlphaBits=4");
                    }
                    args.push("-o");
                    args.push("texput." + formatExt);
                    args.push("texput.pdf");
                }

                    const img = spawn(converter, args, {
                        cwd: tempPath
                    })

                    img.on("error", handleErrors);
                    img.on("exit", (code) => {
                        if (code != 0) {
                            reject(code);
                        } else {
                            returnDocument(formatExt);
                        }
                    });
                 
            };

            /**
             * Returns the document texput followed by the desired ext
             */
            const returnDocument = (ext: string) => {
                const dir = path.join(tempPath, 'texput.' + ext);
                fs.readFile(dir, function (err, buffer) {
                    if (err) {
                        console.log(err);
                        reject(err);                     
                    } else {
                        let output: Buffer | string = buffer;
                        if (toBase64) {
                            output = "data:" + mime.contentType(ext) + ";base64," + buffer.toString("base64");
                        }
                        resolve(output);
                    }
                    fse.remove(tempPath);
                });
            }
        });
    });
}
