import * as temp from "temp";
import * as fs from "fs";
import * as fse from "fs-extra";
import * as path from "path";
import { spawn } from "child_process";
import * as mime from "mime-types";
const strToStream = require('string-to-stream')

/* 
 * 
 * @param format is a string like svg400,300 or png600,400-150
 * accepted formats are
 * svg, png, pngalpha, pdf, jpeg or jpg
 * followed by dimensions width,height
 * and optionally -dpi for raster images
 */
function parseDimensionsAndDpi(format: string) { 
    let width;
    let height;
    let dpi;
    if(format.length) {
        const dims = format.split(",");
        width = dims[0].trim();
        if(dims.length > 1) {
            if (dims[1].indexOf("-") > 0) {
                const parts = dims[1].split("-");
                height = parts[0].trim();
                dpi = parts[1].trim();
            } else {
                height = dims[1].trim();
            }                    
    }
    }
    console.log(width, height, dpi)
    return [width, height, dpi];
}

function parseFormatString(format: string) {
    let term = "svg";
    let termOpts = "font 'Arial,12' linewidth 2 ";
    let ext = "svg";
    let width = "600";
    let height = "400";
    let dpi = "300";

    if (format.startsWith("svg")) {
        dpi = null;
        term = "svg dynamic enhanced";
        const [width2, height2] = parseDimensionsAndDpi(format.substring(3)); 
        width2 && (width = width2);
        height2 && (height = height2);
    }  else if (format.startsWith("pdf")) {
        ext = "pdf";        
        term = "pdf color enhanced";
        dpi = null;
        const [width2, height2] = parseDimensionsAndDpi(format.substring(3)); 
        width2 && (width = width2);
        height2 && (height = height2);
        // DANGER: width and height are inches in pdf terminal so do this conversion
        // ASSUME THAT 1in = 150px
        width = parseInt(width)/150 + "";        
        height = parseInt(height)/150 + "";
    } else if (format.startsWith("png")) {
        ext = "png";   
        const isAlpha = format.startsWith("pngalpha");
        term = isAlpha? "png transparent truecolor enhanced" : "png enhanced";         
        const ntrim = isAlpha ? 8 : 3; 
        const [width2, height2, dpi2] = parseDimensionsAndDpi(format.substring(ntrim)); 
        width2 && (width = width2);
        height2 && (height = height2);
        dpi2 && (dpi = dpi2);
    }  else if (format.startsWith("jpg") || format.startsWith("jpeg")) {
        ext = "jpeg";  
        term = "jpeg enhanced interlace";  
        const ntrim = format.startsWith("jpg") ? 3 : 4; 
        const [width2, height2, dpi2] = parseDimensionsAndDpi(format.substring(ntrim)); 
        width2 && (width = width2);
        height2 && (height = height2);
        dpi2 && (dpi = dpi2);
    }      
    return [ext, term, width, height, dpi, termOpts];
}

/**
 * Transforms a gnuplot script into an image of type which can be optionally converted to base64
 */
export function gnp2Img(src: string, mtype: string, toBase64?: boolean): Promise<Buffer | string> {
    const type = mtype.toLowerCase().trim();
    let output = "";

    return new Promise((resolve, reject) => {
        const dirname = "gnp2Img-" + Math.random().toString(32).substring(2);
        temp.mkdir(dirname, (err, tempPath) => {
            // set the appropiate terminal according to the desired type
            const [ext, terminal, width, height, dpi, terminalOpts] = parseFormatString(type);
            let preamble = "set terminal " + terminal + " size " + width + ","+height + " " + terminalOpts + "\n"                             
            preamble += "set output 'gnuplot." + ext + "'\n";
            src = preamble + src + "\nexit";
            let inputStream = strToStream(src.replace(/;/g, "\n"));
            const args = [ 
            ]
            const opts = {
                cwd: tempPath,
                env: Object.assign({}, process.env, {
                })
            }

            const gnuplot = spawn("gnuplot", args, opts)
            inputStream.pipe(gnuplot.stdin)

            const handleErrors = function (err) {
                reject(err);
            }

            // Prevent Node from crashing on compilation error.
            gnuplot.stdin.on('error', handleErrors)

            gnuplot.on('error', () => {
                handleErrors(new Error(`Error: Unable to run cmd command.`))
            })

            gnuplot.stdout.on('data', (data) => { output += data.toString() + "\n" });
            gnuplot.stderr.on('data', (data) => { output += data.toString() + "\n" });
            gnuplot.on('close', (code) => { });
            gnuplot.on('exit', (code) => {
                if (code !== 0) {
                    reject("gnuplot:: " + code + " " + output);
                } else {
                     returnDocument();
                }
            });

            function returnDocument() {
                    const dir = path.join(tempPath, 'gnuplot.' + ext);
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
