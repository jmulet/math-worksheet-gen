 

import { latexToPdf } from "../../util/latexToPdf"; 
import { latexToOOO } from "../../util/latexToOOO";
import { Worksheet } from "../../interfaces/WsMathGenOpts";
import { AbstractDocumentTree } from "../../interfaces/AbstractDocumentTree";
import { wsExporter, WsExportTypes } from "../../worksheet/wsExporter";
import { WsMathGenerator } from "../../worksheet/WsMathGenerator";
import { wsExporterLatex } from "../../worksheet/wsExporterLatex";
const fs = require("fs")

/**
 * A workbook is the definition of rules which will generate many Sheets
 */
 
const LATEX_FORMATS = ["tex", "latex", "pdf"];

export async function generateSheet(workbook: Worksheet, adt?: AbstractDocumentTree): Promise<{[k in WsExportTypes]: string | Buffer}> {     
    const type = workbook.type;

    const exporterOpts = {includeKeys: workbook.includeKeys, 
        keysPlacement: workbook.keysPlacement, sectionless: workbook.sectionless};

    let sheet = <{[k in WsExportTypes]: string | Buffer}> {};
 
    if (!adt) { 
        // Create abstract document tree
        const gen = new WsMathGenerator({seed: workbook.seed});
        adt = await gen.create(workbook);         
        //Add it to the generated types in order to be stored in database
        sheet["json"] = await wsExporter(adt, "json", exporterOpts); 
    }

    if ( LATEX_FORMATS.indexOf(type) >= 0) {
        
        sheet["latex"] = await wsExporter(adt, "latex", exporterOpts);

        if (type === "pdf") {
            try {
                sheet[type] = await latexToPdf(<string> sheet["latex"]);
            } catch(Ex) {
                console.log(Ex);
            }
        }
    } 
    else if (type === "odt" || type === "docx" ) { 
        // By default figures in latex sheet are in pdf format ... so
        // Generate the latex sheet with figures in png format in order to
        // allow pandoc to include them in the resulting odt
        console.log(adt.graphics.map(e=> e.id))
        const latexSheet = await wsExporterLatex(adt, {toFormat: "png"});
        //fs.writeSync("merda.tex", latexSheet);
        sheet[type] = await latexToPdf(<string> latexSheet, {type: type});                   
    }
    else if (type !== 'json') {
        sheet[type] = await wsExporter(adt, type, exporterOpts);
    }     

    return sheet;
}
